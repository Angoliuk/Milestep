import React, { useState } from "react";
import { Alert } from "../../Components/AlertsAndModals/Alert";
import { LoginRegisterNavBar } from "../../Components/LoginRegisterNavBar/LoginRegisterNavBar";
import NavBar from "../../Components/NavBar/NavBar";
import './PagesWrapping.css'

export const PagesWrapping = (Component, loggedIn=true) => {
    const PagesWrappingWithState = (props) => {
        const [alertShow, setAlertShow] = useState({show: false, text: 'Компанію створено', type: 'success'})
        return(
            <div className="container">
                {loggedIn ? <NavBar /> : <LoginRegisterNavBar />}
                {alertShow.show ? <Alert onClick={() => {setAlertShow({...alertShow, show:false})}} type={alertShow.type} text={alertShow.text} /> : null}
                <Component {...props} alertShowFunc={(alert) => {setAlertShow(alert)}}/>
            </div>
        )
    }
    return (props) => {
        return(PagesWrappingWithState(props))
}
}