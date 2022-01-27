import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import {Link} from 'react-router-dom'
import "./CompaniesPage.css"
import { connect } from 'react-redux'
import { setCompaniesList } from '../../reduxStorage/actions/companies'
import { Select } from '../../Components/select/Select'
import CompaniesOptions from '../../Components/options/CompaniesOptions'
import { PagesWrapping } from '../../hoc/PagesWrapping/PagesWrapping'
import printJS from 'print-js'

function CompaniesPage (props) {

    const [searchName, setSearchName] = useState('')
    const {request} = useHttp()
    const {name, list, isAdmin, setList, alertShowFunc} = props


    const dataRequest = useCallback( async () => {

        try {
            const data = await request("/api/auth/allCompanies", "GET", null)

            isAdmin
            ?   setList(data.sort((a,b) => a.name.localeCompare(b.name)))
            :   setList(data.filter((company) => company.responsible === name).sort((a,b) => a.name.localeCompare(b.name)))
            
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося завантажити данні'})
        }

    } ,[request, isAdmin, name, setList])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    
    const deleteHandlerCompany = useCallback(async(companyToDelete) => {
        try {
            await request('/api/auth/deleteCompany', 'POST', {id: companyToDelete._id})
            if  (companyToDelete.haveLicenses === true){
                await request('/api/auth/LicensesDelete', 'POST', {companyName: companyToDelete.name})
            }
            window.location.reload()
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося видалити компанію'})
        }
        
    }, [request, alertShowFunc])


    const changeHandlerSearchName = (event) => {

        setSearchName(event.target.value)
    }


    const SearchCompany = useCallback(() => {

        let listForSearch = []
        let period = ""

        searchName 
        ? listForSearch = list.filter((company) => company.name === searchName) 
        : listForSearch = list

        const printCompany = (company) => {
            const companyForPrint = company
            companyForPrint.tasks = JSON.stringify(companyForPrint.tasks)
            printJS({printable: [company], properties: ['name', 'edrpou', 'tasks'], type: 'json'})
        }

        return(
            (listForSearch.length > 0)
            ?   listForSearch.map((oneElem, key)=>{
                // const companyJSON = JSON.stringify(oneElem)
                // console.log(typeof companyJSON)
                    return(
                        <div key={key} id={key} className="elementForCompanies">
                            <p>Назва: {oneElem.name}</p>
                            <p>ЄДПРОУ: {oneElem.edrpou}</p>
                            <p>Адреса: {oneElem.address}</p>
                            <p>Номер Телефону: {oneElem.phoneNum}</p>
                            <p>Ліцензування: {oneElem.haveLicenses ? 'Так' : 'Ні'}</p>
                            <p>Основний КВЕД: {oneElem.kwed}</p>
                            <p>Платник ПДВ: {oneElem.payerPDW}</p>
                            <p>Система оподаткування: {oneElem.taxationSystem}</p>
                            <p>Всього робітників: {oneElem.numOfWorkers}</p>
                            <p>Інформація про сплату ЄСВ: {oneElem.infoESW}</p>
                            <p>Відповідальний: {oneElem.responsible}</p>
                            <p>Список завдань: </p>
                            <ol>
                                {oneElem.tasks.map((task)=>{
                                        switch (task.period) {
                                            case '2':
                                                period = 'Щотижня'
                                                break;  
                                
                                            case '3':
                                                period = 'Щомісяця'
                                                break;
                                
                                            case '4':
                                                period = 'Раз у квартал'
                                                break;
                                
                                            case '5':
                                                period = 'Раз у рік'
                                                break;
                                
                                            default:
                                                period = 'Одноразове'
                                                break;
                                        }
                                        return(
                                            <li className='taskElementCompanies' key={task.id}>
                                                <div className="taskContainerCompanies">
                                                    <p className='taskTextCompanies'>Завдання: {task.title}</p>
                                                    <p>Дата: {new Date(task.date).toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                                                    <p className="taskPeriodCompanies">Періодичність: {period}</p>
                                                </div>
                                            </li>
                                        )
                                    })}
                            </ol>
                            <Link className="editButton" to={`/edit/${oneElem._id}`}>
                                <button>Редагувати</button>
                            </Link>
                            <button className='editButton' onClick={() => printCompany(oneElem)}>Друк</button>
                            <button className="companiesButtonDelete" onClick={() => {deleteHandlerCompany(oneElem)}}>Видалити</button>
                        </div>
                    )
                })
            :   <p>Вам не присвоєно компаній</p>

    )}, [list, searchName, deleteHandlerCompany])
    
    return (
        <>

            <Select 
                onChange={changeHandlerSearchName} 
                name="companiesSearch"
                OptionsList={CompaniesOptions} 
                value={searchName}
                label='Назва компанії' 
            />  

            {list ? <SearchCompany />  : <p>Пусто...</p>}

        </> 
        )
}

function mapStateToProps(state) {
    return{
        list: state.companiesInfoReducers.list,
        name: state.userReducers.name,
        isAdmin: state.userReducers.isAdmin,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setList: (list) => dispatch(setCompaniesList(list)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(CompaniesPage))