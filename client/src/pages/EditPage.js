import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { useParams, useHistory } from 'react-router-dom'

export const EditPage = () => {

    const companyId = useParams().id
    const {request} = useHttp() 
    const [users, setUsers] = useState([])
    const [standartTasks, setStandartTasks] = useState({})

    
    const [eForm, setEForm] = useState({
        name:'',
        edrpou: null,
        numOfWorkers: null, 
        payerPDW: '', 
        address: '', 
        phoneNum: null, 
        responsible:'',  
        taxationSystem:'', 
        kwed: '', 
        infoESW: '', 
        tasks:[]
    })

    const [taskParam, setTaskParam] = useState({
        title:'',
        date:'',
        period:'',
        id: 0,
        ready: false
    })


    const changeHandlerForm = (event) => {

        setEForm({...eForm, [event.target.name]: event.target.value})

    }


    const changeHandlerTask = (event) => {

        (event.target.name === 'ready') 
        ? setTaskParam({...taskParam, [event.target.name]: event.target.checked}) 
        : setTaskParam({...taskParam, [event.target.name]: event.target.value})

    }

    let allTasks = eForm.tasks

    const changeHandlerCreatedTask = (position) => (event) => {

        (event.target.name === 'ready') 
        ? allTasks[position][event.target.name] = event.target.checked 
        : allTasks[position][event.target.name] = event.target.value

        setEForm({...eForm, tasks: allTasks})

        }


    const deleteHandlerTask = (position) => {
        let newTasks = eForm.tasks
        newTasks.splice(position, 1)
        newTasks.map((task) => {
            if (task.id > position) {
                task.id--
            }
        })
        setEForm({...eForm, tasks: newTasks})
    }


    const addTask = () => {
        // console.log(taskParam.id)
        let newTasksList = eForm.tasks
        newTasksList.push({
            id: taskParam.id,
            title: taskParam.title,
            date: taskParam.date,
            period: taskParam.period,
            ready: taskParam.ready,
        })
        setEForm({...eForm, tasks: newTasksList})
        setTaskParam({title: '', date:'', period:'', id: eForm.tasks.length, ready: false})
    }


    const TaskList = (()=>{
        const list = eForm.tasks.map((task)=>{
            console.log(task)
            return(
                <form className='taskElement' key={task.id}>
                        <input onChange={changeHandlerCreatedTask(task.id)} value={task.title} name="title" id="title" className="inputForCreate" list="titleDatalist" />
                        <label htmlFor="name">Завдання</label>
                        <select onChange={changeHandlerCreatedTask(task.id)} value={task.period} name="period" id="period" className="inputForCreate">
                            <option value='1'>Одноразове завдання</option>
                            <option value='2'>Щотижня</option>
                            <option value='3'>Щомісяця</option>
                            <option value='4'>Раз у квартал</option>
                            <option value='5'>Раз у рік</option>
                        </select>
                        <label htmlFor="period">Періодичність</label>
                        <input onChange={changeHandlerCreatedTask(task.id)} value={task.date} name="date" id="date" className="inputForCreate" type="date" />
                        <label htmlFor="date">Дата</label>  
                        {/* <div className="checkboxBlock">
                            <input onChange={changeHandlerCreatedTask(task.id)} checked={task.ready} name="ready" id="ready" className="inputForCreate checkboxForCreate" type="checkbox" />
                            <label htmlFor="ready">Готово</label>
                        </div> */}
                        <div>
                            <button className="deleteButton" onClick={() => {deleteHandlerTask(task.id)}}>Видалити завдання</button>
                        </div>
                </form>
            )
        }) 
        return(
            <div>
                {list}
            </div>
        )
    }) 


    const dataRequest = useCallback( async () => {
        try {
            const companyData = await request(`/api/auth/edit/${companyId}`, "GET", null)
            setEForm(companyData)
            setTaskParam({...taskParam, id: companyData.tasks.length})

            const usersData = await request('/api/auth/allUsers', 'GET', null)
            setUsers(usersData)

            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null) 
            setStandartTasks({name: 'standartTasks', info: staticInfo.find((info) => info.name === 'standartTasks').info.sort((a, b) => a.text.localeCompare(b.text))})
            
        } catch (e) {
            console.error(e);
            console.log("here")
        }
    } ,[request, companyId])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const history = useHistory()
    const goBackAfterEdition = () => { history.push('/companies') }

    
    const saveChanges = async () => {
        try {
            await request('/api/auth/updateCompany', 'POST', eForm)
            alert('everything saved')
            goBackAfterEdition()
        } catch (e) {
            console.log(e)
        }
    }

    
    return (
        <div className="container">
            <NavBar />
            <div className="companyElement">

                <div>
                    <h1>Інформація про компанію</h1>
                    <input onChange={changeHandlerForm} value={eForm.name} className="inputForCreate" name="name" id="name"/>
                    <label htmlFor="name">Назва</ label>

                    <input onChange={changeHandlerForm} value={eForm.edrpou} className="inputForCreate" name="edrpou" id="edrpou" type="number"/>
                    <label htmlFor="date">ЄДРПОУ</ label>

                    <input onChange={changeHandlerForm} value={eForm.address} className="inputForCreate" name="address" id="address"/>
                    <label htmlFor="address">Адреса</ label>

                    <input onChange={changeHandlerForm} value={eForm.phoneNum} className="inputForCreate" name="phoneNum" id="phoneNum" type="number"/>
                    <label htmlFor="phoneNum">Номер телефону</ label>

                    <input onChange={changeHandlerForm} value={eForm.kwed} className="inputForCreate" name="kwed" id="kwed"/>
                    <label htmlFor="kwed">Основний КВЕД</ label>

                    <input onChange={changeHandlerForm} value={eForm.payerPDW} className="inputForCreate" name="payerPDW" id="payerPDW"/>
                    <label htmlFor="payerPDW">Платник ПДВ</ label>

                    <input onChange={changeHandlerForm} value={eForm.taxationSystem} className="inputForCreate" name="taxationSystem" id="taxationSystem"/>
                    <label htmlFor="taxationSystem">Сиcтема оподаткування</ label>

                    <input onChange={changeHandlerForm} value={eForm.infoESW} className="inputForCreate" name="infoESW" id="infoESW"/>
                    <label htmlFor="infoESW">Інформація про сплату ЄСВ</ label>

                    <input onChange={changeHandlerForm} value={eForm.numOfWorkers} className="inputForCreate" name="numOfWorkers" id="numOfWorkers" type="number"/>
                    <label htmlFor="numOfWorkers">Всього робітників</ label>
                
                    <div>
                        <select onChange={changeHandlerForm} value={eForm.responsible} name="responsible" id="responsible">
                            {users.map((user) => {
                                return(
                                    <option value={user.name}>{user.name}</option>
                            )
                            })}
                        </select>
                        <label htmlFor="responsible">Відповідальний</ label>
                    </div>
     
                </div>

                <div>
                    <h1>Додати завдання</h1>
                    <input onChange={changeHandlerTask} value={taskParam.title} className="inputForCreate" name="title" id="title" list="titleDatalist"/>
                    <datalist id="titleDatalist">
                        {/* {console.log(standartTasks)} */}
                        {(standartTasks && standartTasks.info)
                        ?
                        standartTasks.info.map((standartTask) => {
                            return(
                                <option value={standartTask.text}>{standartTask.text}</option>
                            )
                        })
                        : 
                            <option>Ви ще не додали стандартні завдання</option>
                    }
                    </datalist>
                    <label htmlFor="title">Завдання</ label>
                    <input onChange={changeHandlerTask} value={taskParam.date} className="inputForCreate" name="date" id="date" type="date"/>
                    <label htmlFor="date">Дата</ label>

                    <div>
                        <select onChange={changeHandlerTask} value={taskParam.period} className="inputForCreate" name="period" id="period">
                            <option value='1'>Одноразове завдання</option>
                            <option value='2'>Щотижня</option>
                            <option value='3'>Щомісяця</option>
                            <option value='4'>Раз у квартал</option>
                            <option value='5'>Раз у рік</option>
                        </select>
                        <label htmlFor="period">періодичність</ label>
                    </div>

                    {/* <div className="checkboxBlock">
                        <input onChange={changeHandlerTask} checked={taskParam.ready} className="inputForCreate checkboxForCreate" name="ready" id="ready" type="checkbox"/>
                        <label htmlFor="ready">Готово</ label>
                    </div> */}

                    <button onClick={addTask}>Додати завдання</button>
                </div>

                <TaskList />
                <button onClick={saveChanges}>Зберегти зміни</button>
            </div>
        </div>
        )
}