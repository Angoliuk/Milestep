import React from "react";
import { connect } from "react-redux";

function StandartTasksOptions (props) {
    const {standartTasks} = props
    return(
        <>
        <option value=''>Всі завдання</option>
        {(standartTasks && standartTasks.info)
            ?   standartTasks.info.map((standartTask, key) => {
                    return <option key={key} value={standartTask.text}>{standartTask.text}</option>
                })
            :   <option value=''>Ви ще не додали стандартні завдання</option>}
        </>
    )
}

function mapStateToProps(state) {
    return{
        standartTasks: state.tasksInfoReducers.standartTasks
    }
}

export default connect(mapStateToProps)(StandartTasksOptions)