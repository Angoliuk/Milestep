import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Input } from '../../Components/input/Input'
import { Select } from '../../Components/select/Select'
import { useHttp } from '../../hooks/http.hook'
import { setCompaniesList, setHistory } from '../../reduxStorage/actions/companies'
import { setStandartTasks } from '../../reduxStorage/actions/tasks'
import CompaniesOptions from '../../Components/options/CompaniesOptions'
import standartTasksOptions from "../../Components/options/StandartTasksOptions";
import "./WorkPage.css"
import { PagesWrapping } from '../../hoc/PagesWrapping/PagesWrapping'

function WorkPage (props) {

    const {name, isAdmin, list, history, setList, setHistory, alertShowFunc, setStandartTasks} = props
    const {request} = useHttp()
    const [numOfDays, setNumOfDays] = useState(5)
    const [searchCompanyName, setSearchCompanyName] = useState('')
    const [searchTaskName, setSearchTaskName] = useState('')

    const dataRequest = useCallback( async () => {

        try {
            const data = await request("/api/auth/allCompanies", "GET", null)

            isAdmin
            ?   setList(data.sort((a,b) => a.name.localeCompare(b.name)))
            :   setList(data.filter((company) => company.responsible === name).sort((a,b) => a.name.localeCompare(b.name)))
            

            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            setHistory(staticInfo.find((info) => info.name === 'history'))

            staticInfo.find((info) => info.name === 'standartTasks').info.sort((a,b) => a.text.localeCompare(b.text))
            setStandartTasks(staticInfo.find((info) => info.name === 'standartTasks'))

        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося завантажити данні'})
        }

    } ,[isAdmin, name, setHistory, setList, request])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const updateHandler = useCallback( async (companyInfo, task) => {
        
        let currentTasksList = list.find(company => company._id === companyInfo._id).tasks
        let currentTask = currentTasksList.find(currentTask => currentTask.id === task.id)

        let newDate = new Date(Date.parse(currentTask.date))
 
        switch (task.period) {
            case '2':
                newDate.setDate(newDate.getDate()+7)
                break;  
    
            case '3':
                newDate.setMonth(newDate.getMonth()+1)
                break;
    
            case '4':
                newDate.setMonth(newDate.getMonth()+3)
                break;

            case '5':
                newDate.setMonth(newDate.getMonth()+12)
                break;

            default:
                currentTasksList.splice(currentTask.id, 1)
                currentTasksList.map((task) => {
                    return(
                        (task.id > currentTask.id)
                        ?   task.id--
                        :   null
                    )
                })
                break;
            }

        if (task.period && task.period !== 1) {

            let companyInHistory = history.info.find((company) => company.name === companyInfo.name)
            let taskInHistory = companyInHistory ? companyInHistory.tasksHistory.find((task) => task.task === currentTask.title) : false 
            let currentDate = new Date().toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric'})

            companyInHistory
            ? taskInHistory
                ? taskInHistory.completeDates.push({date: currentDate, completeToDate: currentTask.date}) 
                : companyInHistory.tasksHistory.push({task: currentTask.title, completeDates: [{date: currentDate, completeToDate: currentTask.date}]})
            : history.info.push({name: companyInfo.name, edrpou: companyInfo.edrpou, tasksHistory: [{task: currentTask.title, completeDates: [{date: currentDate, completeToDate: currentTask.date}]}]})

            currentTask.date = `${newDate.getFullYear()}-${((newDate.getMonth()+1) >= 10) ? newDate.getMonth()+1 : '0' + (newDate.getMonth()+1)}-${(newDate.getDate() >= 10) ? newDate.getDate() : '0' + newDate.getDate() }`

        } 

        try {
            await request("/api/auth/update", "POST", {id: companyInfo._id, tasksList: currentTasksList})
            await request("/api/auth/staticInfoUpdate", "POST", history)
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося виконати завдання'})
        }

    }, [list, request, history])


    const handleChangeInputNumOfDays = (event) => {

        let newNumOfDays = Number(event.target.value)

        newNumOfDays > 735 && newNumOfDays < -1
        ?   setNumOfDays(5)
        :   setNumOfDays(newNumOfDays)

    }

    const handleChangeInputTaskName = (event) => {

        setSearchTaskName(event.target.value)

    }


    const changeHandlerSearchName = (event) => {

        setSearchCompanyName(event.target.value)

    }


    const Search = useCallback(() => {

        let listForSearch = []

        searchCompanyName 
        ? listForSearch = list.filter((company) => company.name === searchCompanyName)
        : listForSearch = list

        let time = new Date()
        time = time.setDate(time.getDate() + numOfDays)
        time = new Date(time)

        return(
            (listForSearch && listForSearch.length > 0)
            ?   listForSearch.map((oneCompany, key) => {
                return(
                    (searchCompanyName !== '' || oneCompany.tasks.filter((task) => searchTaskName ? task.title === searchTaskName && new Date(task.date) <= time : new Date(task.date) <= time).length > 0)
                    ?   <div key={key} className="elementForWork">
                            <p>Назва: {oneCompany.name}</p>
                            <p>ЄДРПОУ: {oneCompany.edrpou}</p>
                            <p>Список завдань: </p>
                            <ol>
                                {oneCompany.tasks.map((task)=>{
                                    return(
                                        (searchTaskName ? task.title === searchTaskName && new Date(task.date) <= time : new Date(task.date) <= time)
                                        ?   <li className='taskElementWork' key={task.id}>
                                                <div className="taskContainerWork">
                                                    <p className='taskTextWork'>Завдання: {task.title}</p>
                                                    <p>Дата: {new Date(task.date).toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                                                    <button className='completeButtonWork' onClick={() => {updateHandler(oneCompany, task)}}>виконано</button>
                                                </div>
                                            </li>
                                        :   null
                                    )
                                })}
                            </ol>
                        </div>
                    : null
                )})
            :   <div>Завдань або компаній у вас немає</div>   
            
        )
        }, [list, searchCompanyName, updateHandler, searchTaskName, numOfDays])

    return (
        <>

            <Input 
                name='numOfDays' 
                onChange={handleChangeInputNumOfDays} 
                value={numOfDays} 
                htmlFor='Кількість днів'
                min={-1}
                max={735}
                type="number"
            />

            <Select 
                onChange={changeHandlerSearchName} 
                value={searchCompanyName} 
                name="companiesSearch"
                OptionsList={CompaniesOptions} 
                label='Компанії' 
            /> 

            <Select 
                onChange={handleChangeInputTaskName} 
                value={searchTaskName} 
                name="tasksSearch"
                OptionsList={standartTasksOptions} 
                label='Завдання' 
            /> 

            <Search />
        </>
        )
}

function mapStateToProps(state) {
    return{
        list: state.companiesInfoReducers.list,
        standartTasks: state.tasksInfoReducers.standartTasks,
        history: state.companiesInfoReducers.history,
        name: state.userReducers.name,
        isAdmin: state.userReducers.isAdmin,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setList: (list) => dispatch(setCompaniesList(list)),
        setHistory: (history) => dispatch(setHistory(history)),
        setStandartTasks: (standartTasks) => dispatch(setStandartTasks(standartTasks)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(WorkPage))