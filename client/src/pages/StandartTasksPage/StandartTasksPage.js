import "./StandartTasksPage.css"
import { useHttp } from '../../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"
import { connect } from "react-redux"
import { setStandartTasks } from "../../reduxStorage/actions/tasks"
import { Input } from '../../Components/input/Input'
import { PagesWrapping } from '../../hoc/PagesWrapping'

function StandartTasksPage (props) {
    
    const {request} = useHttp() 
    const [taskText, setTaskText] = useState('')
    const {standartTasks, setStandartTasks} = props
    
    const dataRequest = useCallback(async () => {

        try {
            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null) 
            setStandartTasks(staticInfo.find((info) => info.name === 'standartTasks'))
        } catch (e) {
            console.log(e)
        }

    }, [request, setStandartTasks])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const addHandlerStandartTasks = async () => {

        setStandartTasks({...standartTasks,
             info: [...standartTasks.info, {
                 text: taskText, 
                 id: (standartTasks.info.length > 0) ? standartTasks.info.length : 0} ]
                })
                
        setTaskText('')

    }

    const changeHandlerTaskText = (event) => {

        setTaskText(event.target.value)

    }

    const saveChanges = async () => {

        try {
            await request('/api/auth/staticInfoUpdate', 'POST', standartTasks)
            alert('saved changes')
        } catch (e) {
            console.log(e)
        }

    }

    const deleteHandlerStandartTasks = (position) => { 

        let newStandartTasks = standartTasks.info

        newStandartTasks.splice(newStandartTasks.findIndex((task) => task.id === position), 1)
        newStandartTasks.map((task) => {
            return(
                (task.id > position)
                ?   task.id--
                :   null
            )
        })
        
        setStandartTasks({...standartTasks, info: newStandartTasks})
    }


    return(
        <div className="element">
            <Input 
                name='email' 
                onChange={changeHandlerTaskText} 
                value={taskText} 
                htmlFor='Нове завдання'
            />
            <button onClick={addHandlerStandartTasks}>Додати завдання</button>
            <button onClick={saveChanges}>Зберегти всі зміни</button>
            <ol>
            {(standartTasks.info && standartTasks.info.length > 0) 
            ?
                standartTasks.info.sort((a, b) => a.text.localeCompare(b.text)).map((standartTask, key) => {
                    return(
                        <li key={key} className="standartTask">
                            <span className="standartTaskText">{standartTask.text}</span>
                            <button onClick={() => {deleteHandlerStandartTasks(standartTask.id)}} className="standartTaskDelete">Видалити</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(StandartTasksPage))