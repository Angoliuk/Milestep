import React, {useCallback, useEffect, useState} from 'react'
import { connect } from 'react-redux'
import { useHttp } from '../../hooks/http.hook'
import { setStandartTasks } from '../../reduxStorage/actions/tasks'
import "./CreatePage.css"
import { setUsersList } from '../../reduxStorage/actions/companies'
import { InputsAboutCompany } from '../../Components/InputsAboutCompany.js/InputsAboutCompany'
import { InputsForCreateTask } from '../../Components/InputsForCreateTask/InputsForCreateTask'
import { PagesWrapping } from '../../hoc/PagesWrapping/PagesWrapping'

function CreatePage(props) {

    const {request} = useHttp() 
    const [eForm, setEForm] = useState({
        name: undefined,
        edrpou: undefined,
        numOfWorkers: undefined, 
        payerPDW: undefined, 
        address: undefined, 
        phoneNum: undefined,
        haveLicenses: false, 
        responsible:undefined,  
        taxationSystem:undefined, 
        kwed: undefined, 
        infoESW: undefined, 
        tasks:[]
    })
    const [taskParam, setTaskParam] = useState({title: undefined, date: undefined, period: undefined, id: 0})
    const {setStandartTasks, setUsers, alertShowFunc} = props


    const changeHandlerForm = (event) => {

        event.target.type === 'checkbox'
        ?   setEForm({...eForm, [event.target.name]: event.target.checked}) 
        :   setEForm({...eForm, [event.target.name]: event.target.value}) 

    }


    const dataRequest = useCallback( async () => {

        try {
            const data = await request('/api/auth/allUsers', 'GET', null)
            setUsers(data)

            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            setStandartTasks({name: 'standartTasks', info: staticInfo.find((info) => info.name === 'standartTasks').info.sort((a, b) => a.text.localeCompare(b.text))})

        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося завантажити данні'})
        }

    }, [request, setStandartTasks, setUsers])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const changeHandlerTask = (event) => {

        setTaskParam({...taskParam, [event.target.name]: event.target.value})
        
    }


    const TaskList = (()=>{

        let period = ''
        const list = eForm.tasks.map((task, key)=>{
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
                <div className='taskElementForCreate' key={key}>
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
            await request('/api/auth/create', 'POST', eForm)
            if (eForm.haveLicenses === true){
                await request('/api/auth/LicensesPost', 'POST', {companyName: eForm.name, licensesList: []})
            }
            setEForm({name:'', edrpou: '', numOfWorkers: '', payerPDW: '', address: '', phoneNum: '', haveLicenses:false, responsible:'',  taxationSystem:'', kwed: '', infoESW: '', tasks:[]})
            setTaskParam({title: '', date:'', period:'', id: 0})
            alertShowFunc({show: true, type:'success', text:'Компанію збережено'})

        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося додати компанію'})
        }

    }

    return(
        <div className="element">

            <InputsAboutCompany changeHandlerForm={changeHandlerForm} eForm={eForm} />

            <InputsForCreateTask taskParam={taskParam} changeHandlerTask={changeHandlerTask} addTask={addTask} /> 

            <TaskList />
            
            <button onClick={addCompany}>Додати Компанію</button>

        </div>
    )
}

function mapStateToProps(state) {
    return{
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setStandartTasks: (standartTasks) => dispatch(setStandartTasks(standartTasks)),
        setUsers: (users) => dispatch(setUsersList(users)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(CreatePage))