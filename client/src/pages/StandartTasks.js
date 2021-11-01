import { NavBar } from "../Components/NavBar"
import "./pages.css"
import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"

export const StandartTasks = () => {
    
    const {request} = useHttp() 
    const [standartTasks, setStandartTasks] = useState([])
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


    const updateHandlerStandartTasks = async () => {
        
        standartTasks.info.push({
            text: taskText,
            id: standartTasks.info[standartTasks.info.length-1].id+1
        })
        console.log(standartTasks.info)
        try {
            await request('/api/auth/staticInfoUpdate', 'POST', standartTasks)
        } catch (e) {
            console.log(e)
        }

    }

    const changeHandlerTaskText = (event) => {

        setTaskText(event.target.value)

    }


    return(
        <div className="container">
            <NavBar />
            <div className="companyElement">
                <input onChange={changeHandlerTaskText} className="inputForCreate" />
                <button onClick={updateHandlerStandartTasks}>add</button>
                {(standartTasks.info) 
                ?
                standartTasks.info.map((standartTask) => {
                    return(
                        <div>
                            <p value={taskText}>{standartTask.text}</p>
                            <button className="deleteButton">remove</button>
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