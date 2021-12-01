import { NavBar } from "../Components/NavBar"
import "./pages.css"
import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"

export const StandartTasksPage = () => {
    
    const {request} = useHttp() 
    const [standartTasks, setStandartTasks] = useState({})
    const [taskText, setTaskText] = useState('')
    
    const dataRequest = useCallback(async () => {

        try {
            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null) 
            setStandartTasks(staticInfo.find((info) => info.name === 'standartTasks'))
        } catch (e) {
            console.log(e)
        }

    }, [request])

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
        <div className="container">
            <NavBar />
            <div className="companyElement">
                <input onChange={changeHandlerTaskText} value={taskText} className="inputForCreate" />
                <button onClick={addHandlerStandartTasks}>Додати завдання</button>
                <button onClick={saveChanges}>Зберегти всі зміни</button>
                {(standartTasks.info && standartTasks.info.length > 0) 
                ?
                    standartTasks.info.sort((a, b) => a.text.localeCompare(b.text)).map((standartTask, key) => {
                        return(
                            <div key={key} className="standartTask">
                                <span className="standartTaskText">{standartTask.text}</span>
                                <button onClick={() => {deleteHandlerStandartTasks(standartTask.id)}} className="deleteButton">Видалити</button>
                            </div>
                        )
                    })
                : 
                    <div>
                        <p>Немає стандартних завдань</p>
                    </div>
                }
            </div>
        </div>
    )
}