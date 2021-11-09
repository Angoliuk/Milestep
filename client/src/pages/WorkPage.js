import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import "./pages.css"

export const WorkPage = () => {

    const {token,userId, name ,logout} = useContext(AuthContext)
    const [list, setList] = useState([])
    const [taskswHistory, setTaskswHistory] = useState({})
    const [numOfDays, setNumOfDays] = useState(5)
    const {loading, request} = useHttp()
    const [searchName, setSearchName] = useState()

    const logoutHandler = async () => {
        try {
            logout()
        } catch (e) {
            
        }
    }

    const dataRequest = useCallback( async () => {
        try {
            const data = await request("/api/auth/allCompanies", "GET", null)
            setList(data.filter((company) => company.responsible === name))

            const staticInfos = await request("/api/auth/staticInfoGet", "GET", null) /// ???????????????????????????
            console.log(staticInfos.find((info) => info.name === 'history')) /// ???????????????????????????
            setTaskswHistory(staticInfos.find((info) => info.name === 'history')) /// ???????????????????????????
        } catch (e) {
            console.error(e);
            console.log("here")
        }
    } ,[request, name])


    const updateHandler = useCallback( async (companyInfo, task) => {
        
        let currentTasksList = list.find(company => company._id === companyInfo._id).tasks
        let currentTask = currentTasksList.find(currentTask => currentTask.id === task.id)

        // currentTask.ready = true
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

        (task.period) 
        ?   currentTask.date = `${newDate.getFullYear()}-${((newDate.getMonth()+1) >= 10) ? newDate.getMonth()+1 : '0' + (newDate.getMonth()+1)}-${(newDate.getDate() >= 10) ? newDate.getDate() : '0' + newDate.getDate() }`
        :   currentTask = null

        // let test = tasksHistory
        console.log(taskswHistory) /// ???????????????????????????
        // console.log(companyInfo)
        // console.log(test)
        // console.log(test.info)
        // console.log(companyInfo.name)
        // console.log(companyInfo)
        // test.info.find((company) => company.name === companyInfo.name)


        try {
            await request("/api/auth/update", "POST", {id: companyInfo._id, tasksList: currentTasksList})
            await request("/api/auth/staticInfoUpdate", "POST", {id: companyInfo._id, tasksList: currentTasksList})
            alert("saved")
        } catch (e) {
            console.log(e)
        }

    }, [list, request])

    const handleChangeInput = (event) => {

        let newNumOfDays = Number(event.target.value)

        if (newNumOfDays < 0 || newNumOfDays > 735) {
            setNumOfDays(5)
        }else{
            setNumOfDays(newNumOfDays)
        }

    }

    let time = new Date()

    const changeHandlerSearchName = (event) => {
        setSearchName(event.target.value)
    }

    const SearchTasks = useCallback(() => {

        let listForSearch = []

        searchName 
        ? listForSearch = list.filter((company) => company.name === searchName) 
        : listForSearch = list

        time = time.setDate(time.getDate() + numOfDays)
        time = new Date(time)
    


        return(
            listForSearch.map((oneCompany)=>{
                return(
                    <div className="companyElement">
                        <p>Назва: {oneCompany.name}</p>
                        <p>ЄДРПОУ: {oneCompany.edrpou}</p>
                        <p>Список завдань: </p>
                        <ol>
                            {oneCompany.tasks.map((task)=>{
                                if (new Date(task.date) <= time) {
                                    return(
                                        <li className='taskElement' key={task.id}>
                                            <p>Завдання: {task.title}</p>
                                            <span>Дата: {new Date(task.date).toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric' })}</span>
                                            {/* <span>Готово: {(task.ready) ? "Так" : "Ні"}</span> */}
                                            <button onClick={() => {updateHandler(oneCompany, task)}}>виконано</button>
                                        </li>
                                    )
                                }  
                            })}
                        </ol>
                    </div>)
                })
        )
        }, [list, searchName, updateHandler, time])

    useEffect(() => {
        SearchTasks()
    })

        useEffect(() => {
        dataRequest()
    }, [dataRequest])

    return (
        <div className="container">

            <NavBar />
            <input onChange={handleChangeInput} value={numOfDays} className="searchInput" name="numOfDays" max="735" id="numOfDays" type="number" />
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

            <SearchTasks />
            
        </div>
        )
}