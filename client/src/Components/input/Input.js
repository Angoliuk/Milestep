import React from "react";
import './Input.css'

export const Input = ({name, value = undefined, onChange, classes = 'input',min=null, max=null, type = 'text', htmlFor = '', DatalistOptions=null}) => {
    return(
        <div className={type==='checkbox' ? 'checkboxBlock' : null}>
            {
            type==='checkbox' 
            ?   <input onChange={onChange} checked={value} className={classes} name={name} id={name} type={type}/>
            :   <input onChange={onChange} value={value} className={classes} name={name} min={min} max={max} id={name} type={type} list={DatalistOptions ? name+'Datalist' : null}/>
            }
            {
            DatalistOptions
            ?   <datalist id={name+'Datalist'}>
                    <DatalistOptions />
                </datalist>
            :   null
            }
            <label htmlFor={name}>{htmlFor}</ label>
        </div>
    )
}