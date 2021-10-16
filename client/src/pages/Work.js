import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

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
        list.find(company => company._id === companyInfo._id).tasks[task.id].ready = true
        let tasksList = list.find(company => company._id === companyInfo._id).tasks
        console.log(tasksList)
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
        console.log(numOfDays)
    }

    let time = new Date()
    time = time.setDate(time.getDate() + numOfDays)
    console.log(new Date(time), numOfDays)
    time = new Date(time)

    return (
        <div className="container">
            <NavBar />
            <input onChange={handleChangeInput} value={numOfDays} name="numOfDays" max="90" id="numOfDays" type="number" />
            <label htmlFor="numOfDays">Кількість днів</label>
            {/* <button onClick={dataRequest}>Show</button> */}
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
                                        // console.log(new Date(task.date), time)
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