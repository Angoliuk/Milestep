import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { useHttp } from '../hooks/http.hook'
import {Link, NavLink} from 'react-router-dom'
import "./pages.css"
import { AuthContext } from '../context/AuthContext'

export const CompaniesPage = () => {

    const [list, setList] = useState([])
    const [searchName, setSearchName] = useState()
    const {request} = useHttp()
    const {name, isAdmin} = useContext(AuthContext)


    const dataRequest = useCallback( async () => {

        try {
            const data = await request("/api/auth/allCompanies", "GET", null)

            isAdmin
            ?   setList(data.sort((a,b) => a.name.localeCompare(b.name)))
            :   setList(data.filter((company) => company.responsible === name).sort((a,b) => a.name.localeCompare(b.name)))
            
        } catch (e) {
            console.error(e);
            console.log("here")
        }

    } ,[request, isAdmin, name])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    
    const deleteHandlerCompany = useCallback(async(id) => {

        try {
            await request('/api/auth/deleteCompany', 'POST', {id})
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
        
    }, [request])


    const changeHandlerSearchName = (event) => {

        setSearchName(event.target.value)
    }


    const SearchCompany = useCallback(() => {

        let listForSearch = []
        let period = ""

        searchName 
        ? listForSearch = list.filter((company) => company.name === searchName) 
        : listForSearch = list

        return(
            (listForSearch.length > 0)
            ?   listForSearch.map((oneElem, key)=>{
                    return(
                        <div key={key} className="companyElement">
                            <p>Назва: {oneElem.name}</p>
                            <p>ЄДПРОУ: {oneElem.edrpou}</p>
                            <p>Адреса: {oneElem.address}</p>
                            <p>Номер Телефону: {oneElem.phoneNum}</p>
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
                                            <li className='taskElement' key={task.id}>
                                                <div className="taskContainer">
                                                    <p className='taskText'>Завдання: {task.title}</p>
                                                    <p>Дата: {new Date(task.date).toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                                                    <p className="taskPeriod">Періодичність: {period}</p>
                                                </div>
                                            </li>
                                        )
                                    })}
                            </ol>
                            <Link className="editButton" to={`/edit/${oneElem._id}`}>
                                <button>Редагувати</button>
                            </Link>
                            <button className="deleteButton" onClick={() => {deleteHandlerCompany(oneElem._id)}}>Видалити</button>
                        </div>
                    )
                })
            :   <p>Вам не присвоєно компаній</p>

    )}, [list, searchName, deleteHandlerCompany])


    useEffect(() => {
        SearchCompany()
    })
    

    return (
        <div className="container">
            
            <NavBar />
            <select onChange={changeHandlerSearchName} name="companiesSearch" id="companiesSearch">
                <option value=''>Всі компанії</option>
                {
                    list.map((company, key) => {
                        return(
                            <option key={key} value={company.name}>{key+1}. {company.name}</option>
                        )
                    })
                }
            </select>
            <label htmlFor="companiesSearch">Назва компанії</label>

            {list ? <SearchCompany /> : <p>Пусто...</p>}
        </div>
        )
}