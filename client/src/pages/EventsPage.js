import React, { useCallback, useContext, useEffect, useState } from 'react'
import { NavBar } from '../Components/NavBar'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'

export const EventsPage = () => {

    let [list, setList] = useState([])
    const {token,userId ,logout} = useContext(AuthContext)
    const {loading, request} = useHttp()

    //
    const logoutHandler = async () => {
        try {
            logout()
        } catch (e) {
            
        }
    }
    //

    const dataRequest = useCallback( async () => {
        try {
            const data = await request("/api/auth/events", "GET", null)
            console.log('data', data);
            setList(data)
        } catch (e) {
            console.error(e);
            console.log("here")
        }
    } ,[request, token])
    

    return (
        <div className="container">
            <NavBar />
           <button onClick={dataRequest}>Show</button>
           {list && list.map((oneElem)=>{
               return(
                <div className="element">
                    <p>Дата:{oneElem.date}</p>
                    <p>Опис:{oneElem.description}</p>
                </div>)
           })}  
        </div>
        )
}