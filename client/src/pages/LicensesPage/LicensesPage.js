import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Input } from "../../Components/input/Input";
import { Select } from "../../Components/select/Select";
import { useHttp } from "../../hooks/http.hook";
import { setCompanyLicenses } from "../../reduxStorage/actions/companies";
import './LicensesPage.css'
import LicensesOptions from "../../Components/options/LicensesOptions";
import { PagesWrapping } from "../../hoc/PagesWrapping/PagesWrapping";

function LicensesPage (props) {

    const {request} = useHttp()
    const {licenses, setLicenses, alertShowFunc} = props
    const [newLicense, setNewLicense] = useState({
        companyName: undefined,
        starts: undefined,
        ends: undefined,
        licenseName: undefined,
        address: undefined,
    }) 

    const dataRequest = useCallback(async () => {

        try {
            const data = await request("/api/auth/licensesGet", "GET", null)
            setLicenses(data.sort((a,b) => a.companyName.localeCompare(b.companyName)))
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося завантажити данні'})
        }

    }, [request, setLicenses])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const changeHandlerLicense = (event) => {

        setNewLicense({
            ...newLicense,
            [event.target.name]: event.target.value,
        })

    }

    const addLicense = async() => {

        try {
            let updatedLicense = licenses.find((company) => company.companyName === newLicense.companyName)
            updatedLicense.licensesList.push({starts: newLicense.starts, ends: newLicense.ends, licenseName: newLicense.licenseName, address: newLicense.address})

            await request('/api/auth/LicensesUpdate', 'POST', {companyName: updatedLicense.companyName, licensesList: updatedLicense.licensesList})

            setNewLicense({
                companyName: '',
                starts: '',
                ends: '',
                licenseName: '',
                address: '',
            })
            alertShowFunc({show: true, type:'success', text:'Ліцензію додано'})
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося додати ліцензію'})
        }

    }

    const LicensesTable = () => {
        return(
            <table className='tableForLicenses'>    
                <thead>
                    <tr>
                        <th className='thForLicenses'>Компанія</th>
                        <th className='thForLicenses' colSpan='4' >Ліцензії</th>
                    </tr>
                </thead>           
                <tbody>
                    {licenses.length>0
                    ?   licenses.map((company, i) => {
                            return(
                                <React.Fragment key={i}>
                                    <tr>
                                        <th className='thForLicenses' rowSpan={licenses[i].licensesList.length+1}>{company.companyName}</th>
                                    </tr>
                                    {
                                    company.licensesList.map((license, i) => {
                                        return(
                                            <tr key={i}>
                                                <th className='thForLicenses'>З: {license.starts}</th>
                                                <th className='thForLicenses'>До: {license.ends}</th>
                                                <th className='thForLicenses'>Вид: {license.licenseName}</th>
                                                <th className='thForLicenses'>Адреса: {license.address}</th>
                                            </tr>
                                        )})
                                    }
                                </React.Fragment>)})
                    :   <tr>
                            <th className='thForLicenses' colSpan='5'>У вас ще немає ліцензій</th>
                        </tr>
                    }
                </tbody>
            </table>
        )

    }


    return(
        <>

            <Select 
                onChange={changeHandlerLicense} 
                value={newLicense.companyName} 
                name="companyName"
                OptionsList={LicensesOptions} 
                label='Kомпанія' 
            /> 

            <Input 
                name='licenseName' 
                onChange={changeHandlerLicense} 
                value={newLicense.licenseName} 
                htmlFor='Назва Ліцензії'
            />

            <Input 
                name='starts' 
                onChange={changeHandlerLicense} 
                value={newLicense.starts} 
                htmlFor='Початок'
                classes='inputDate'
                type="date"
            />

            <Input 
                name='ends' 
                onChange={changeHandlerLicense} 
                value={newLicense.ends} 
                htmlFor='Кінець'
                classes='inputDate'
                type="date"
            />

            <Input 
                name='address' 
                onChange={changeHandlerLicense} 
                value={newLicense.address} 
                htmlFor='Адреса'
            />

            <div>
                <button onClick={addLicense}>Додати ліцензію</button>
            </div>

            <LicensesTable />

        </>
    )
}

function mapStateToProps(state) {
    return{
        licenses: state.companiesInfoReducers.licenses
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setLicenses: (licenses) => dispatch(setCompanyLicenses(licenses))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(LicensesPage))