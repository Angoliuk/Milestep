import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import "./pages.css"

export const WorkPage = () => {

    const {token,userId, name ,logout} = useContext(AuthContext)
    const [list, setList] = useState([])
    const [numOfDays, setNumOfDays] = useState(3)
    const {loading, request} = useHttp()

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
        } catch (e) {
            console.error(e);
            console.log("here")
        }
    } ,[request, name])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const updateHandler = useCallback( async (companyInfo, task) => {
        let currentTasksList = list.find(company => company._id === companyInfo._id).tasks
        let currentTask = currentTasksList.find(currentTask => currentTask.id === task.id)
        currentTask.ready = true
        let newDate = new Date(Date.parse(currentTask.date))
        switch (task.period) {
            case '2':
                newDate.setDate(newDate.getDate()+14)
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
                newDate.setDate(newDate.getDate()+7)
                break;
            }
        currentTask.date = `${newDate.getFullYear()}-${((newDate.getMonth()+1) >= 10) ? newDate.getMonth()+1 : '0' + (newDate.getMonth()+1)}-${(newDate.getDate() >= 10) ? newDate.getDate() : '0' + newDate.getDate() }`
        console.log(currentTask.date)

        let tasksList = list.find(company => company._id === companyInfo._id).tasks

        try {
            await request("/api/auth/update", "POST", {id: companyInfo._id, tasksList: tasksList})
            alert("saved")
        } catch (e) {
            console.log(e)
        }
        // 
    }, [list, request])

    const handleChangeInput = (event) => {
        let newNumOfDays = Number(event.target.value)
        if (newNumOfDays < 0 || newNumOfDays > 735) {
            setNumOfDays(3)
        }else{
            setNumOfDays(newNumOfDays)
        }
    }

    let time = new Date()
    time = time.setDate(time.getDate() + numOfDays)
    // console.log(new Date(time), numOfDays)
    time = new Date(time)

    return (
        <div className="container">

            <NavBar />
            <input onChange={handleChangeInput} value={numOfDays} className="searchInput" name="numOfDays" max="735" id="numOfDays" type="number" />
            <label htmlFor="numOfDays">Кількість днів</label>

            {
                list.map((oneCompany)=>{
                    return(
                        <div className="companyElement">
                            <p>Назва: {oneCompany.name}</p>
                            <p>ЄДПРОУ: {oneCompany.edrpou}</p>
                            <p>Список завдань: </p>
                            <ol>
                                {oneCompany.tasks.map((task)=>{
                                    if (!task.ready && new Date(task.date) <= time) {
                                        return(
                                            <li className='taskElement' key={task.id}>
                                                <p>Завдання: {task.title}</p>
                                                <span>Дата: {task.date}</span>
                                                <span>Готово: {(task.ready) ? "Так" : "Ні"}</span>
                                                <button onClick={() => {updateHandler(oneCompany, task)}} disabled={loading}>виконано</button>
                                            </li>
                                        )
                                    }  
                                })}
                            </ol>
                        </div>)
                   })}
        </div>
        )
}