import React from "react";
import { connect } from "react-redux";


function CompaniesOptions(props) {
    const {list} = props
    return(
        <>
            <option value=''>Всі компанії</option>
            {
            list.map((company, key) => {
                return(
                    <option key={key} value={company.name}>{key+1}. {company.name}</option>
                )
            })
            }
        </>
    )   
}

function mapStateToProps(state) {
    return{
        list: state.companiesInfoReducers.list,
    }
}

export default connect(mapStateToProps)(CompaniesOptions)