import React from "react";
import { Input } from "../input/Input";
import standartTasksOptions from "../options/StandartTasksOptions";
import TaskPeriodOptions from "../options/TaskPeriodOptions";
import { Select } from "../select/Select";

export function InputsForCreateTask(props) {

    const {taskParam, changeHandlerTask, addTask} = props

    return(
        <div>
            <h1>Додати завдання</h1>
            <Input 
                name='title' 
                onChange={changeHandlerTask} 
                value={taskParam.title} 
                htmlFor='Завдання'
                DatalistOptions={standartTasksOptions} 
            />

            <Input 
                name='date' 
                onChange={changeHandlerTask} 
                value={taskParam.date} 
                classes='inputDate'
                htmlFor='Дата'
                type="date"
            />

            <Select 
                onChange={changeHandlerTask} 
                value={taskParam.period} 
                name="period"
                OptionsList={TaskPeriodOptions} 
                label='Періодичність' 
            />      

            <button onClick={addTask}>Додати завдання</button>
        </div>
    )
}