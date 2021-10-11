import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const WorkPage = () => {

    let [list, setList] = useState([])
    const [numOfDays, setNumOfDays] = useState(5)
    const {token,userId ,logout} = useContext(AuthContext)
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
            setList(data)
        } catch (e) {
            console.error(e);
            console.log("here")
        }
    } ,[request])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const updateHandler = async (companyInfo, task) => {
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
    }

    const handleChangeInput = (event) => {
        setNumOfDays(event.target.value)
        console.log(numOfDays)
    }

    return (
        <div className="container">
            <NavBar />
            <input onChange={handleChangeInput} name="numOfDays" id="numOfDays" type="number" />
            <label htmlFor="numOfDays">Кількість днів</label>
            <button onClick={dataRequest}>Show</button>
            {list && list.map((oneCompany)=>{
                let time = new Date()
                time = time.setDate(time.getDate() + numOfDays)
                time = new Date(time)
               if (oneCompany.tasks.find(item => item.ready === false) !== -1 && oneCompany.tasks.find(item => new Date(item.date) <= time) !== -1) {
                return(
                    <div className="element">
                        <p>Назва: {oneCompany.name}</p>
                        <p>ЄДПРОУ: {oneCompany.edrpou}</p>
                        <p>Номер Телефону: {oneCompany.phoneNum}</p>
                        <p>Список завдань: </p>
                        <ol>
                            {oneCompany.tasks.map((task)=>{
                                if (!task.ready && new Date(task.date) <= time) {
                                    return(
                                        <li className='element' key={task.id}>
                                            <p>Завдання: {task.title}</p>
                                            <p>Дата: {task.date}</p>
                                            <p>Готово: {(task.ready) ? "Так" : "Ні"}</p>
                                            <button onClick={() => {updateHandler(oneCompany, task)}} disabled={loading}>виконано</button>
                                        </li>
                                    )
                                }  
                            })}
                        </ol>
                    </div>)
               }
               
           })}  
        </div>
        )
}