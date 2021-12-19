import React from "react";
import { connect } from "react-redux";

function HistoryOptions (props) {
    const {history} = props
    return(
        <>
            <option value=''>Всі компанії</option>
            {(history && history.info)
                ?   history.info.map((company, key) => {
                        return (
                            <option key={key} value={company.name}>{company.name}</option>
                        )})
                :   <option value=''>Історія ваших компаній пуста</option>}
        </>
    )
}

function mapStateToProps(state) {
    return{
        history: state.companiesInfoReducers.history
    }
}

export default connect(mapStateToProps)(HistoryOptions)