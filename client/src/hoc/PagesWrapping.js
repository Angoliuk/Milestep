import React from "react";
import NavBar from "../Components/NavBar/NavBar";
import './PagesWrapping.css'

export const PagesWrapping = (Component) => {
    return (props) => {
        return(
            <div className="container">
                <NavBar />
                <Component {...props}/>
            </div>
        )
    }   
}