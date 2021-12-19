import React from "react";
import { connect } from "react-redux";

function UsersOptions (props) {
    const {users} = props
    return(
        <>
            <option value=''>Відповідальний відсутній</option>
            {users.map((user, key) => {
                return(
                    <option key={key} value={user.name}>{user.name}</option>
                )
            })}
        </>
    )
}

function mapStateToProps(state) {
    return{
        users: state.companiesInfoReducers.users
    }
}

export default connect(mapStateToProps)(UsersOptions)