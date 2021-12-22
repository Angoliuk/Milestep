import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../../hooks/http.hook'
import { useParams, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { setStandartTasks } from '../../reduxStorage/actions/tasks'
import './EditPage.css'
import { Select } from '../../Components/select/Select'
import TaskPeriodOptions from '../../Components/options/TaskPeriodOptions'
import { Input } from '../../Components/input/Input'
import StandartTasksOptions from '../../Components/options/StandartTasksOptions'
import { setUsersList } from '../../reduxStorage/actions/companies'
import { InputsAboutCompany } from '../../Components/InputsAboutCompany.js/InputsAboutCompany'
import { InputsForCreateTask } from '../../Components/InputsForCreateTask/InputsForCreateTask'
import { PagesWrapping } from '../../hoc/PagesWrapping/PagesWrapping'

function EditPage (props) {

    const companyId = useParams().id
    const {request} = useHttp() 
    const {setStandartTasks, setUsers, alertShowFunc} = props

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

    const [taskParam, setTaskParam] = useState({
        title: undefined,
        date: undefined,
        period: undefined,
        id: 0,
    })


    const changeHandlerForm = (event) => {

        event.target.type === 'checkbox'
        ?   setEForm({...eForm, [event.target.name]: event.target.checked}) 
        :   setEForm({...eForm, [event.target.name]: event.target.value}) 

    }


    const changeHandlerTask = (event) => {

        setTaskParam({...taskParam, [event.target.name]: event.target.value})

    }


    const changeHandlerCreatedTask = (position) => (event) => {

        let allTasks = eForm.tasks

        allTasks[position][event.target.name] = event.target.value

        setEForm({...eForm, tasks: allTasks})

        }


    const deleteHandlerTask = (position) => {

        let newTasks = eForm.tasks

        newTasks.splice(position, 1)
        newTasks.map((task) => {
            return(
                (task.id > position)
                ?   task.id--
                :   null
            )
        })

        setEForm({...eForm, tasks: newTasks})
    }


    const addTask = () => {

        let newTasksList = eForm.tasks

        newTasksList.push({
            id: taskParam.id,
            title: taskParam.title,
            date: taskParam.date,
            period: taskParam.period,
        })

        setEForm({...eForm, tasks: newTasksList})
        setTaskParam({title: '', date:'', period:'', id: eForm.tasks.length})
    }


    const TaskList = (()=>{
        const list = eForm.tasks.map((task)=>{
            return(
                <form className='taskElement' key={task.id}>
                    <Input
                        name='title' 
                        onChange={changeHandlerCreatedTask(task.id)} 
                        value={task.title} 
                        htmlFor='Завдання'
                        DatalistOptions={StandartTasksOptions}  
                    />
                    <Input 
                        name='date' 
                        onChange={changeHandlerCreatedTask(task.id)} 
                        value={task.date} 
                        classes='inputDate'
                        htmlFor='Дата'
                        type="date"
                    />   
                    <Select 
                        onChange={changeHandlerCreatedTask(task.id)} 
                        value={task.period} 
                        name="period"
                        OptionsList={TaskPeriodOptions} 
                        label='Періодичність' 
                    />
                    <div>
                        <button className="editDelete" onClick={() => {deleteHandlerTask(task.id)}}>Видалити завдання</button>
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
            alertShowFunc({show: true, type:'error', text:'Невдалося завантажити данні'})
        }

    } ,[request, setStandartTasks, companyId])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const history = useHistory()
    const goBackAfterEdit = () => { history.push('/companies') }

    
    const saveChanges = async () => {

        try {
            await request('/api/auth/updateCompany', 'POST', eForm)
            eForm.haveLicenses === true
            ?   await request('/api/auth/LicensesPost', 'POST', {companyName: eForm.name, licensesList: []})
            :   await request('/api/auth/LicensesDelete', 'POST', {companyName: eForm.name})
            alertShowFunc({show: true, type:'success', text:'Зміни збережено'})
            goBackAfterEdit()
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося зберегти зміни'})
        }

    }

    
    return (
            <div className="element">

                <InputsAboutCompany changeHandlerForm={changeHandlerForm} eForm={eForm} />

                <InputsForCreateTask taskParam={taskParam} changeHandlerTask={changeHandlerTask} addTask={addTask} /> 

                <TaskList />

                <button onClick={saveChanges}>Зберегти зміни</button>

            </div>
        )
}

function mapStateToProps(state) {
    return{
        standartTasks: state.tasksInfoReducers.standartTasks
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setStandartTasks: (standartTasks) => dispatch(setStandartTasks(standartTasks)),
        setUsers: (users) => dispatch(setUsersList(users)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(EditPage))