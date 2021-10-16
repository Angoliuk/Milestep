import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import {NavLink} from 'react-router-dom'

export const CompaniesPage = () => {

    const [list, setList] = useState([])
    const [searchName, setSearchName] = useState()
    const {token,userId ,logout} = useContext(AuthContext)
    const {loading, request} = useHttp()

    const logoutHandler = async () => {
        try {
            logout()
        } catch (e) {
            
        }
    }

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
        console.log(list)
        let listForSearch = []
        let listCompletedTasks = []
        let sortedList = []
        if (searchName) {
                listForSearch = list.filter((company) => company.name === searchName)
                listForSearch.forEach(company => {
                listCompletedTasks = company.tasks.filter((task) => task.ready === true)
                sortedList = company.tasks.filter((task) => task.ready === false)
                sortedList = [...sortedList, ...listCompletedTasks]
                company.tasks = sortedList
                });
            }else{
                listForSearch = list
                listForSearch.forEach(company => {
                listCompletedTasks = company.tasks.filter((task) => task.ready === true)
                sortedList = company.tasks.filter((task) => task.ready === false)
                sortedList = [...sortedList, ...listCompletedTasks]
                company.tasks = sortedList
            })};
        return(
            listForSearch.map((oneElem)=>{
                return(
                <div className="companyElement">
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
                                    <li className='taskElement' key={task.id}>
                                        <p>Завдання: {task.title}</p>
                                        <span>Періодичність: {task.period} місяці</span>
                                        <span>Дата: {task.date}</span>
                                        <span>Готово: {(task.ready) ? "Так" : "Ні"}</span>
                                    </li>
                                )
                            })}
                    </ol>
                    <button><NavLink className="editButton" to={`/edit/${oneElem._id}`}>Редагувати</NavLink></button>
                    <button className="deleteButton" onClick={() => {deleteHandlerCompany(oneElem._id)}}>Видалити</button>
                </div>)
            }))  
    }, [list, searchName, deleteHandlerCompany])

    const dataRequest = useCallback( async () => {
        try {
            const data = await request("/api/auth/allCompanies", "GET", null)
            console.log(data)
            setList(data)
        } catch (e) {
            console.error(e);
            console.log("here")
        }
    } ,[request])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    useEffect(() => {
        SearchCompany()
    })
    

    return (
        <div className="container">
            <NavBar />
            <input onChange={changeHandlerSearchName} className="searchInput" name="companiesSearch" id="companiesSearch" list="companiesSearchList" />
            <label htmlFor="companiesSearch">Назва компанії</label>
            {/* <button onClick={() => {setSearchName()}}>Пошук</button> */}
            <datalist id="companiesSearchList" >
                {
                    list.map((company) => {
                        return(
                            <option value={company.name} />
                        )
                    })
                }
            </datalist>
            <SearchCompany />
        </div>
        )
}