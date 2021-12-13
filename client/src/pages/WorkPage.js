import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import NavBar from '../Components/NavBar'
import { useHttp } from '../hooks/http.hook'
import { setCompaniesList, setHistory } from '../reduxStorage/actions/companies'
import { setStandartTasks } from '../reduxStorage/actions/tasks'
import "./pages.css"

function WorkPage (props) {

    // const {name, isAdmin} = useContext(AuthContext)
    const {request} = useHttp()
    const [numOfDays, setNumOfDays] = useState(5)
    const [searchCompanyName, setSearchCompanyName] = useState('')
    const [searchTaskName, setSearchTaskName] = useState('')

    const dataRequest = useCallback( async () => {

        try {
            const data = await request("/api/auth/allCompanies", "GET", null)

            props.isAdmin
            ?   props.setList(data.sort((a,b) => a.name.localeCompare(b.name)))
            :   props.setList(data.filter((company) => company.responsible === props.name).sort((a,b) => a.name.localeCompare(b.name)))
            

            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            props.setHistory(staticInfo.find((info) => info.name === 'history'))
            staticInfo.find((info) => info.name === 'standartTasks').info.sort((a,b) => a.text.localeCompare(b.text))
            props.setStandartTasks(staticInfo.find((info) => info.name === 'standartTasks'))

        } catch (e) {
            console.error(e);
            console.log("here")
        }

    } ,[request, props.name, props.isAdmin])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const updateHandler = useCallback( async (companyInfo, task) => {
        
        let currentTasksList = props.list.find(company => company._id === companyInfo._id).tasks
        let currentTask = currentTasksList.find(currentTask => currentTask.id === task.id)

        let newDate = new Date(Date.parse(currentTask.date))
 
        switch (task.period) {
            case '2':
                newDate.setDate(newDate.getDate()+7)
                break;  
    
            case '3':
                newDate.setMonth(newDate.getMonth()+1)
                break;
    
            case '4':
                newDate.setMonth(newDate.getMonth()+3)
                break;

            case '5':
                newDate.setMonth(newDate.getMonth()+12)
                break;

            default:
                currentTasksList.splice(currentTask.id, 1)
                currentTasksList.map((task) => {
                    return(
                        (task.id > currentTask.id)
                        ?   task.id--
                        :   null
                    )
                })
                break;
            }

        if (task.period && task.period !== 1) {

            let companyInHistory = props.history.info.find((company) => company.name === companyInfo.name)
            let taskInHistory = companyInHistory ? companyInHistory.tasksHistory.find((task) => task.task === currentTask.title) : false 
            let currentDate = new Date().toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric'})

            companyInHistory
            ? taskInHistory
                ? taskInHistory.completeDates.push({date: currentDate, completeToDate: currentTask.date}) 
                : companyInHistory.tasksHistory.push({task: currentTask.title, completeDates: [{date: currentDate, completeToDate: currentTask.date}]})
            : props.history.info.push({name: companyInfo.name, edrpou: companyInfo.edrpou, tasksHistory: [{task: currentTask.title, completeDates: [{date: currentDate, completeToDate: currentTask.date}]}]})

            currentTask.date = `${newDate.getFullYear()}-${((newDate.getMonth()+1) >= 10) ? newDate.getMonth()+1 : '0' + (newDate.getMonth()+1)}-${(newDate.getDate() >= 10) ? newDate.getDate() : '0' + newDate.getDate() }`

        } 

        try {
            await request("/api/auth/update", "POST", {id: companyInfo._id, tasksList: currentTasksList})
            await request("/api/auth/staticInfoUpdate", "POST", props.history)
            alert("saved")
        } catch (e) {
            console.log(e)
        }

    }, [props.list, request, props.history])


    const handleChangeInputNumOfDays = (event) => {

        let newNumOfDays = Number(event.target.value)

        newNumOfDays > 735 && newNumOfDays < -1
        ?   setNumOfDays(5)
        :   setNumOfDays(newNumOfDays)

    }

    const handleChangeInputTaskName = (event) => {

        setSearchTaskName(event.target.value)

    }


    const changeHandlerSearchName = (event) => {

        setSearchCompanyName(event.target.value)

    }


    const SearchTasks = useCallback(() => {

        let listForSearch = []

        searchCompanyName 
        ? listForSearch = props.list.filter((company) => company.name === searchCompanyName)
        : listForSearch = props.list

        let time = new Date()
        time = time.setDate(time.getDate() + numOfDays)
        time = new Date(time)

        return(
            (listForSearch && listForSearch.length > 0)
            ?   listForSearch.map((oneCompany, key) => {
                return(
                    (searchCompanyName !== '' || oneCompany.tasks.filter((task) => searchTaskName ? task.title === searchTaskName && new Date(task.date) <= time : new Date(task.date) <= time).length > 0)
                    ?   <div key={key} className="companyElement">
                            <p>Назва: {oneCompany.name}</p>
                            <p>ЄДРПОУ: {oneCompany.edrpou}</p>
                            <p>Список завдань: </p>
                            <ol>
                                {oneCompany.tasks.map((task)=>{
                                    return(
                                        (searchTaskName ? task.title === searchTaskName && new Date(task.date) <= time : new Date(task.date) <= time)
                                        ?   <li className='taskElement' key={task.id}>
                                                <div className="taskContainer">
                                                    <p className='taskText'>Завдання: {task.title}</p>
                                                    <p>Дата: {new Date(task.date).toLocaleString('uk-UA', {year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                                                    <button onClick={() => {updateHandler(oneCompany, task)}}>виконано</button>
                                                </div>
                                            </li>
                                        :   null
                                    )
                                })}
                            </ol>
                        </div>
                    : null
                )})
            :   <div>Завдань або компаній у вас немає</div>   
            
        )
        }, [props.list, searchCompanyName, updateHandler, searchTaskName, numOfDays])


    useEffect(() => {
        SearchTasks()
    })

    return (
        <div className="container">
            <NavBar />
            <input onChange={handleChangeInputNumOfDays} value={numOfDays} className="searchInput" name="numOfDays" min="-1" max="735" id="numOfDays" type="number" />
            <label htmlFor="numOfDays">Кількість днів</label>
            <div>
                <select onChange={changeHandlerSearchName} className="selectSearchInput" name="companiesSearch" id="companiesSearch">
                    <option value=''>Всі компанії</option>
                    {
                        (props.list)
                        ?   props.list.map((company, key) => {
                                return(
                                    <option key={key} value={company.name}>{company.name}</option>
                                )
                            })
                        :   <option value=''>Немає компаній</option>
                    }
                </select>
            </div>
            <div>
                <select onChange={handleChangeInputTaskName} className="selectSearchInput" name="tasksSearch" id="tasksSearch">
                    <option value=''>Всі завдання</option>
                    {
                        (props.standartTasks && props.standartTasks.info)
                            ?   props.standartTasks.info.map((task, key) => {
                                    return(
                                        <option key={key} value={task.text}>{task.text}</option>
                                )})
                            :   <option value=''>Немає завдань</option>
                    }
                </select>
            </div>
{/* props.list */}
            {props.list ? <SearchTasks /> : <p>Пусто...</p>}
            
        </div>
        )
}

function mapStateToProps(state) {
    return{
        list: state.companiesInfoReducers.list,
        standartTasks: state.tasksInfoReducers.standartTasks,
        history: state.companiesInfoReducers.history,
        name: state.userReducers.name,
        isAdmin: state.userReducers.isAdmin,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setList: (list) => dispatch(setCompaniesList(list)),
        setHistory: (history) => dispatch(setHistory(history)),
        setStandartTasks: (standartTasks) => dispatch(setStandartTasks(standartTasks)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkPage)