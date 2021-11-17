import React, {useCallback, useEffect, useState} from 'react'
import { NavBar } from '../Components/NavBar'
import { useHttp } from '../hooks/http.hook'
import "./pages.css"

export const CreatePage = () => {

    const {request} = useHttp() 
    const [users, setUsers] = useState([])
    const [eForm, setEForm] = useState({
        name:'',
        edrpou:null,
        numOfWorkers: null, 
        payerPDW: '', 
        address: '', 
        phoneNum:null, 
        responsible:'',  
        taxationSystem:'', 
        kwed: '', 
        infoESW: '', 
        tasks:[]
    })
    const [taskParam, setTaskParam] = useState({title:'', date: 0, period:'', id: 0})
    const [standartTasks, setStandartTasks] = useState({})


    const changeHandlerForm = (event) => {

        setEForm({...eForm, [event.target.name]: event.target.value}) 

    }


    const dataRequest = useCallback( async () => {

        try {
            const data = await request('/api/auth/allUsers', 'GET', null)
            setUsers(data)

            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            setStandartTasks({name: 'standartTasks', info: staticInfo.find((info) => info.name === 'standartTasks').info.sort((a, b) => a.text.localeCompare(b.text))})

        } catch (e) {
            console.log(e)
        }

    }, [request])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const changeHandlerTask = (event) => {

        setTaskParam({...taskParam, [event.target.name]: event.target.value})
        
    }


    const TaskList = (()=>{

        let period = ''
        const list = eForm.tasks.map((task)=>{
            switch (task.period) {
                case '2':
                    period = 'Щотижня'
                    break;  
    
                case '3':
                    period = 'Щомісяця'
                    break;
    
                case '4':
                    period = 'Раз у квартал'
                    break;
    
                case '5':
                    period = 'Раз у рік'
                    break;
    
                default:
                    period = 'Одноразове'
                    break;
            }
            return(
                <div className='taskElement' key={task.id}>
                    <p>Завдання: {task.title}</p>
                    <p>Періодичність: {period}</p>
                    <p>Дата: {new Date(task.date).toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
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
        })

        setEForm({...eForm, tasks: newTasksList})
        setTaskParam({title: '', date:'', period:'', id: taskParam.id + 1})

    }


    const addCompany = async () => {

        try {
            console.log(eForm)
                await request('/api/auth/create', 'POST', eForm)
                setEForm({name:'', edrpou: null, numOfWorkers: null, payerPDW: null, address: '', phoneNum: null, responsible:'',  taxationSystem:'', kwed: '', infoESW: '', tasks:[]})
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
                        <select onChange={changeHandlerForm} defaultValue={eForm.responsible} name="responsible" id="responsible">
                            <option value=''>Ви не вибрали відповідального</option>
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
                        {(standartTasks && standartTasks.info)
                        ?
                            standartTasks.info.map((standartTask) => {
                                return <option value={standartTask.text}>{standartTask.text}</option>
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

                    <button onClick={addTask}>Додати завдання</button>
                </div>

                <TaskList />
                <button onClick={addCompany}>Додати Компанію</button>
            </div>
        </div>
    )
}