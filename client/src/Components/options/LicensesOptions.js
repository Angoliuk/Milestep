import React from "react";
import { connect } from "react-redux";


function LicensesOptions(props) {
    const {licenses} = props
    return(
        <>
            <option value=''>Ви не вибрали компанію</option>
            {
            licenses.map((company) => {
                    return(
                        <option key={company._id} value={company.companyName}>{company.companyName}</option>
                )})
            }
        </>
    )   
}

function mapStateToProps(state) {
    return{
        licenses: state.companiesInfoReducers.licenses,
    }
}

export default connect(mapStateToProps)(LicensesOptions)