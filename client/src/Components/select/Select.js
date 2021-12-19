import React from "react";
import './Select.css'

export const Select = ({onChange, value='', name, classes='select', OptionsList=null, label=''}) => {
    return(
        <div>
            <select className={classes} onChange={onChange} value={value} name={name} id={name}>
                {OptionsList
                ? <OptionsList />
                : null}
            </select>
            <label htmlFor={name}>{label}</ label>
        </div>
    )
}