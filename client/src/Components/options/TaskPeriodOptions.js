import React from "react";
 
export default function TaskPeriodOptions (props) {
    return(
        <>
            <option value='1'>Одноразове завдання</option>
            <option value='2'>Щотижня</option>
            <option value='3'>Щомісяця</option>
            <option value='4'>Раз у квартал</option>
            <option value='5'>Раз у рік</option>
        </>
    )
}