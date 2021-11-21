import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import "./pages.css"

export const WorkPage = () => {

    const [list, setList] = useState([])
    const {name, isAdmin} = useContext(AuthContext)
    const {request} = useHttp()
    const [history, setHistory] = useState()
    const [standartTasks, setStandartTasks] = useState([])
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
            console.error(e);
            console.log("here")
        }

    } ,[request, name, isAdmin])

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
                    if (task.id > currentTask.id) {
                        task.id--
                    }})
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
            alert("saved")
        } catch (e) {
            console.log(e)
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


    const SearchTasks = useCallback(() => {

        let listForSearch = []

        searchCompanyName 
        ? listForSearch = list.filter((company) => company.name === searchCompanyName)
        : listForSearch = list

        let time = new Date()
        time = time.setDate(time.getDate() + numOfDays)
        time = new Date(time)

        return(
            (listForSearch && listForSearch.length > 0)
            ?   listForSearch.map((oneCompany) => {
                    if (searchCompanyName !== '' || oneCompany.tasks.filter((task) => searchTaskName ? task.title === searchTaskName && new Date(task.date) <= time : new Date(task.date) <= time).length > 0) {
                        return(
                            <div className="companyElement">
                                <p>Назва: {oneCompany.name}</p>
                                <p>ЄДРПОУ: {oneCompany.edrpou}</p>
                                <p>Список завдань: </p>
                                <ol>
                                    {oneCompany.tasks.map((task)=>{
                                        if (searchTaskName ? task.title === searchTaskName && new Date(task.date) <= time : new Date(task.date) <= time) {
                                            return(
                                                <li className='taskElement' key={task.id}>
                                                    <div className="taskContainer">
                                                        <p className='taskText'>Завдання: {task.title}</p>
                                                        <p>Дата: {new Date(task.date).toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                                                        <button onClick={() => {updateHandler(oneCompany, task)}}>виконано</button>
                                                    </div>
                                                </li>
                                            )
                                        }  
                                    })}
                                </ol>
                            </div>
                        )}
                    })
            :   <div>Завдань або компаній у вас немає</div>
            
        )
        }, [list, searchCompanyName, updateHandler, searchTaskName, numOfDays])


    useEffect(() => {
        SearchTasks()
    })

    return (
        <div className="container">
            <NavBar />
            <input onChange={handleChangeInputNumOfDays} value={numOfDays} className="searchInput" name="numOfDays" min="-1" max="735" id="numOfDays" type="number" />
            <label htmlFor="numOfDays">Кількість днів</label>
            <div>
                <select onChange={changeHandlerSearchName} className="selectSearchInput" name="companiesSearch" id="companiesSearch">
                    <option value=''>Всі компанії</option>
                    {
                        list.map((company) => {
                            return(
                                <option value={company.name}>{company.name}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div>
                <select onChange={handleChangeInputTaskName} className="selectSearchInput" name="tasksSearch" id="tasksSearch">
                    <option value=''>Всі завдання</option>
                    {
                        (standartTasks && standartTasks.info)
                            ?   standartTasks.info.map((task) => {
                                    return(
                                        <option value={task.text}>{task.text}</option>
                                )})
                            :   <option value=''>Немає завдань</option>
                    }
                </select>
            </div>

            {list ? <SearchTasks /> : <p>Пусто...</p>}
            
        </div>
        )
}