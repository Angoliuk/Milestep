import React, {useContext, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import { NavBar } from '../Components/NavBar'
import { useHttp } from '../hooks/http.hook'
import "./pages.css"

export const CreatePage = () => {

    const {loading, request} = useHttp() 
    const {userId, token} = useContext(AuthContext)

    const [eForm, setEForm] = useState({
        date:'', description:'', owner: userId, token: token
    })

    const changeHandler = event => {
        setEForm({...eForm, [event.target.name]: event.target.value})
        console.log(eForm)
    }

    const addEv = async () => {
        try {
                const data = await request('/api/auth/create', 'POST', eForm)
                alert("event created")
            
        } catch (e) {
            
        }
    }

    return(
        <div className="main-block">
            <NavBar />
            <h1>Create new event</h1>
            <div>
                <input onChange={changeHandler} name="date" id="date" type="date"/>
                <label htmlFor="date">date</ label>
            </div>
            <div className="textarea-block">
                <p className="desc-label">description</p>
                <textarea className='description-input' onChange={changeHandler} name="description" id="description"/>
            </div>
            
            <button onClick={addEv}>Add event</button>
        </div>
    )
}