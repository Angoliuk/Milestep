import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const CompaniesPage = () => {

    let [list, setList] = useState([])
    const {token,userId ,logout} = useContext(AuthContext)
    const {loading, request} = useHttp()

    //
    const logoutHandler = async () => {
        try {
            logout()
        } catch (e) {
            
        }
    }
    //

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
    

    return (
        <div className="container">
            <NavBar />
            {list && list.map((oneElem)=>{
               return(
                <div className="element">
                    <p>Назва: {oneElem.name}</p>
                    <p>ЄДПРОУ: {oneElem.edrpou}</p>
                    <p>Всього робітників: {oneElem.numOfWorkers}</p>
                    <p>Платник ПДВ: {(oneElem.payerPDW) ? "Так" : "Ні"}</p>
                    <p>Адреса: {oneElem.address}</p>
                    <p>Номер Телефону: {oneElem.phoneNum}</p>
                    <p>Сума оплати: {oneElem.salary}</p>
                    <p>Система оподаткування: {oneElem.taxationSystem}</p>
                    <p>Відповідальний: {oneElem.responsible}</p>
                    <p>Список завдань: </p>
                    <ol>
                        {oneElem.tasks.map((task)=>{
                            return(
                                <li className='element' key={task.id}>
                                    <p>Завдання: {task.title}</p>
                                    <p>Періодичність: {task.period} місяці</p>
                                    <p>Дата: {task.date}</p>
                                    <p>Готово: {(task.ready) ? "Так" : "Ні"}</p>
                                </li>
                            )
                        })}
                    </ol>
                </div>)
           })}  
        </div>
        )
}