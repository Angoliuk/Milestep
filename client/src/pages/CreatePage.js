import React, {useCallback, useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { NavBar } from '../Components/NavBar'
import { useHttp } from '../hooks/http.hook'
import "./pages.css"

export const CreatePage = () => {

    const {loading, request} = useHttp() 
    const {userId, token} = useContext(AuthContext)
    const [users, setUsers] = useState([])


    const [eForm, setEForm] = useState({
        name:'', edrpou:'', numOfWorkers: '', payerPDW: null, address: '', phoneNum:'', salary:'', responsible:'',  taxationSystem:'', tasks:[],
    })
    const [taskParam, setTaskParam] = useState({title:'', date:'', period:'', id: 0,  ready: false})

    const changeHandlerForm = (event) => {
        if(event.target.name === 'payerPDW'){
            setEForm({...eForm, [event.target.name]: event.target.checked})
            console.log(eForm)
        }else{
            setEForm({...eForm, [event.target.name]: event.target.value})
            console.log(eForm)
        }
    }

    const dataRequest = useCallback(async () => {
        try {
            const data = await request('/api/auth/allUsers', 'GET', null)
            setUsers(data)
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }, [request])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const changeHandlerTask = (event) => {
        if (event.target.name === 'ready') {
            setTaskParam({...taskParam, [event.target.name]: event.target.checked})
        }else{
            setTaskParam({...taskParam, [event.target.name]: event.target.value})
        }
    }

    const TaskList = (()=>{
        const list = eForm.tasks.map((task)=>{
            return(
                <div className='taskElement' key={task.id}>
                    <p>Завдання: {task.title}</p>
                    <p>Періодичність: {task.period}</p>
                    <p>Дата: {task.date}</p>
                    <p>Готово: {(task.ready) ? "Так" : "Ні"}</p>
                </div>
            )
        }) 
        return(
            <div>
                {list}
            </div>
        )
    }) 

    const addTask = () => {
        let newTasksList = eForm.tasks
        newTasksList.push({
            id: taskParam.id,
            title: taskParam.title,
            date: taskParam.date,
            period: taskParam.period,
            ready: taskParam.ready,
        })
        setEForm({...eForm, tasks: newTasksList})
        setTaskParam({title: '', date:'', period:'', id: taskParam.id + 1, ready: false})
    }

    const addCompany = async () => {
        try {
                await request('/api/auth/create', 'POST', eForm)
                setEForm({name:'', edrpou:'', numOfWorkers: '', payerPDW: null, address: '', phoneNum:'', salary:'', responsible:'',  taxationSystem:'', tasks:[],})
                alert("event created")
            
        } catch (e) {
            alert('error')
        }
    }

    return(
        <div className="container">
            <NavBar />
            <div className="companyElement">
                <div>
                    <h1>Інформація про компанію</h1>
                        <input onChange={changeHandlerForm} value={eForm.name} className="inputForCreate" name="name" id="name"/>
                        <label htmlFor="name">Назва</ label>
                        <input onChange={changeHandlerForm} value={eForm.edrpou} className="inputForCreate" name="edrpou" id="edrpou" type="number"/>
                        <label htmlFor="date">ЄДПРОУ</ label>
                        <input onChange={changeHandlerForm} value={eForm.address} className="inputForCreate" name="address" id="address"/>
                        <label htmlFor="address">Адреса</ label>
                        <input onChange={changeHandlerForm} value={eForm.phoneNum} className="inputForCreate" name="phoneNum" id="phoneNum" type="number"/>
                        <label htmlFor="phoneNum">Номер телефону</ label>
                        <input onChange={changeHandlerForm} value={eForm.numOfWorkers} className="inputForCreate" name="numOfWorkers" id="numOfWorkers" type="number"/>
                        <label htmlFor="numOfWorkers">Всього робітників</ label>
                        <input onChange={changeHandlerForm} value={eForm.salary} className="inputForCreate" name="salary" id="salary" type="number"/>
                        <label htmlFor="salary">Сума оплати</ label>
                    <div>
                        <input onChange={changeHandlerForm} value={eForm.responsible} className="inputForCreate" name="responsible" id="responsible" list="responsibleDataList" />
                        <datalist id="responsibleDataList">
                            {users.map((user) => {
                                return(
                                    <option value={user.name}/>
                            )
                            })}
                        </datalist>
                        <label htmlFor="responsible">Відповідальний</ label>
                    </div>
                        <input onChange={changeHandlerForm} value={eForm.taxationSystem} className="inputForCreate" name="taxationSystem" id="taxationSystem"/>
                        <label htmlFor="taxationSystem">Сиcтема оподаткування</ label>
                    <div className="checkboxBlock">
                        <input onChange={changeHandlerForm} checked={eForm.payerPDW} className="inputForCreate checkboxForCreate" name="payerPDW" id="payerPDW" type="checkbox"/>
                        <label htmlFor="payerPDW">Платник ПДВ</ label>
                    </div>
                </div>
                <div>
                    <h1>Додати завдання</h1>
                        <input onChange={changeHandlerTask} value={taskParam.title} className="inputForCreate" name="title" id="title"/>
                        <label htmlFor="title">Завдання</ label>
                        <input onChange={changeHandlerTask} value={taskParam.date} className="inputForCreate" name="date" id="date" type="date"/>
                        <label htmlFor="date">Дата</ label>
                    <div>
                        <input onChange={changeHandlerTask} value={taskParam.period} className="inputForCreate" name="period" id="period" type="number"/>
                        <label htmlFor="period">періодичність</ label>
                    </div>
                    <div className="checkboxBlock">
                        <input onChange={changeHandlerTask} checked={taskParam.ready} className="inputForCreate checkboxForCreate" name="ready" id="ready" type="checkbox"/>
                        <label htmlFor="ready">Готово</ label>
                    </div>
                    <button onClick={addTask}>Додати завдання</button>
                </div>
                <TaskList />
                <button onClick={addCompany}>Додати Компанію</button>
            </div>
        </div>
    )
}