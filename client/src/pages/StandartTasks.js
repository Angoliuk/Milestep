import { NavBar } from "../Components/NavBar"
import "./pages.css"
import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"

export const StandartTasks = () => {
    
    const {request} = useHttp() 
    const [standartTasks, setStandartTasks] = useState({})
    const [taskText, setTaskText] = useState('')
    
    const dataRequest = useCallback(async () => {
        try {
            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null) 
            setStandartTasks(staticInfo.find((info) => info.name === 'standartTasks' ))
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
                 id: (standartTasks.info.length > 0) ? standartTasks.info[standartTasks.info.length-1].id+1 : 0} ]
                })
        setTaskText('')
        console.log(standartTasks)

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
        newStandartTasks.splice(position, 1)
        newStandartTasks.map((task) => {
            if (task.id > position) {
                task.id--
            }
        })
        setStandartTasks({...standartTasks, info: newStandartTasks})
        console.log(standartTasks)
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
                    standartTasks.info.map((standartTask) => {
                        return(
                            <div>
                                <p>{standartTask.text}</p>
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