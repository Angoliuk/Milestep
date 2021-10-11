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
                <div className='element' key={task.id}>
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
        setTaskParam({...taskParam, id: taskParam.id + 1})
    }

    const addCompany = async () => {
        try {
                await request('/api/auth/create', 'POST', eForm)
                alert("event created")
            
        } catch (e) {
            alert('error')
        }
    }

    return(
        <div className="main-block">
            <NavBar />
            <div>
                <h1>Create new event</h1>
                <div>
                    <input onChange={changeHandlerForm} name="name" id="name"/>
                    <label htmlFor="name">Назва</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="edrpou" id="edrpou" type="number"/>
                    <label htmlFor="date">ЄДПРОУ</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="payerPDW" id="payerPDW" type="checkbox"/>
                    <label htmlFor="payerPDW">Платник ПДВ</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="address" id="address"/>
                    <label htmlFor="address">Адреса</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="phoneNum" id="phoneNum" type="number"/>
                    <label htmlFor="phoneNum">Номер телефону</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="numOfWorkers" id="numOfWorkers" type="number"/>
                    <label htmlFor="numOfWorkers">Всього робітників</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="salary" id="salary" type="number"/>
                    <label htmlFor="salary">Сума оплати</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="responsible" id="responsible" list="responsibleDataList" />
                    <datalist id="responsibleDataList">
                        {console.log(users)}
                        {users.map((user) => {
                            return(
                                <option value={user.name}/>
                        )
                        })}
                    </datalist>
                    <label htmlFor="responsible">Відповідальний</ label>
                </div>
                <div>
                    <input onChange={changeHandlerForm} name="taxationSystem" id="taxationSystem"/>
                    <label htmlFor="taxationSystem">Сиcтема оподаткування</ label>
                </div>
            </div>
            <div>
                <h1>Add task</h1>
                <div>
                    <input onChange={changeHandlerTask} name="title" id="title"/>
                    <label htmlFor="title">Завдання</ label>
                </div>
                <div>
                    <input onChange={changeHandlerTask} name="date" id="date" type="date"/>
                    <label htmlFor="date">Дата</ label>
                </div>
                <div>
                    <input onChange={changeHandlerTask} name="ready" id="ready" type="checkbox"/>
                    <label htmlFor="ready">Готово</ label>
                </div>
                <div>
                    <input onChange={changeHandlerTask} name="period" id="period" type="number"/>
                    <label htmlFor="period">періодичність</ label>
                </div>
                <button onClick={addTask}>Додати завдання</button>
            </div>
            <TaskList />

            {/* <div className="textarea-block">
                <p className="desc-label">description</p>
                <textarea className='description-input' onChange={changeHandler} name="description" id="description"/>
            </div> */}
            
            <button onClick={addCompany}>Add company</button>
        </div>
    )
}