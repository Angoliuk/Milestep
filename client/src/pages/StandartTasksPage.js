import { NavBar } from "../Components/NavBar"
import "./pages.css"
import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"
import { connect } from "react-redux"
import { setStandartTasks } from "../reduxStorage/actions/tasks"

function StandartTasksPage (props) {
    
    const {request} = useHttp() 
    const [taskText, setTaskText] = useState('')
    
    const dataRequest = useCallback(async () => {

        try {
            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null) 
            props.setStandartTasks(staticInfo.find((info) => info.name === 'standartTasks'))
        } catch (e) {
            console.log(e)
        }

    }, [request])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const addHandlerStandartTasks = async () => {

        props.setStandartTasks({...props.standartTasks,
             info: [...props.standartTasks.info, {
                 text: taskText, 
                 id: (props.standartTasks.info.length > 0) ? props.standartTasks.info.length : 0} ]
                })
                
        setTaskText('')

    }

    const changeHandlerTaskText = (event) => {

        setTaskText(event.target.value)

    }

    const saveChanges = async () => {

        try {
            await request('/api/auth/staticInfoUpdate', 'POST', props.standartTasks)
            alert('saved changes')
        } catch (e) {
            console.log(e)
        }

    }

    const deleteHandlerStandartTasks = (position) => { 

        let newStandartTasks = props.standartTasks.info

        newStandartTasks.splice(newStandartTasks.findIndex((task) => task.id === position), 1)
        newStandartTasks.map((task) => {
            return(
                (task.id > position)
                ?   task.id--
                :   null
            )
        })
        
        props.setStandartTasks({...props.standartTasks, info: newStandartTasks})
    }


    return(
        <div className="container">
            <NavBar />
            <div className="companyElement">
                <input onChange={changeHandlerTaskText} value={taskText} className="inputForCreate" />
                <button onClick={addHandlerStandartTasks}>Додати завдання</button>
                <button onClick={saveChanges}>Зберегти всі зміни</button>
                <ol>
                {(props.standartTasks.info && props.standartTasks.info.length > 0) 
                ?
                    props.standartTasks.info.sort((a, b) => a.text.localeCompare(b.text)).map((standartTask, key) => {
                        return(
                            <li key={key} className="standartTask">
                                <span className="standartTaskText">{standartTask.text}</span>
                                <button onClick={() => {deleteHandlerStandartTasks(standartTask.id)}} className="deleteButton">Видалити</button>
                            </li>
                        )
                    })
                : 
                    <div>
                        <p>Немає стандартних завдань</p>
                    </div>
                }
                </ol>
            </div>
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
        setStandartTasks: (standartTasks) => dispatch(setStandartTasks(standartTasks)) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StandartTasksPage)