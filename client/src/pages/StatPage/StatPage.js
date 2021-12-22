import { connect } from "react-redux"
import React, { useCallback, useEffect} from "react"
import { useHttp } from '../../hooks/http.hook'
import { setCompaniesList } from "../../reduxStorage/actions/companies"
import printJS from "print-js"
import './StatPage.css'
import { PagesWrapping } from "../../hoc/PagesWrapping/PagesWrapping"

function StatPage (props) {

    const {request} = useHttp()
    const {companies, setCompanies, alertShowFunc} = props


    const dataRequest = useCallback( async () => {
        
        try {
            const data = await request('/api/auth/allCompanies', 'GET', null)
            setCompanies(data)
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося завантажити данні'})
        }

    }, [request, setCompanies])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const WorkersTable = () => {
        return(
            <div>
                <button className='printForStat' onClick={() => {printJS({printable: 'workersTable', type: 'html', targetStyles: ['*']})}}>Друк</button>
                <table className='tableForStat' id="workersTable">
                    <thead>
                        <tr>
                            <th className='thForStat'>Компанія</th>
                            <th className='thForStat'>Робітників</th>
                        </tr>
                    </thead>  
                    <tbody>
                        {companies.map((company) => {
                            return(
                            company.numOfWorkers > 0
                            ?   <tr key={company._id}>
                                    <th className='thForStat'>
                                        {company.name}
                                    </th>
                                    <th className='thForStat'>
                                        {company.numOfWorkers}
                                    </th>
                                </tr>
                            :   null
                        )})}
                    </tbody>
                </table>
            </div>
        )
    }

    const Statistics = () => {

        return(
            <div className="element elementForStat">
                <p>Всього платників: {companies.length}</p>
                <p>Всього ФОПів: {companies.filter((company) => company.edrpou.toString().length === 10).length}</p>
                <p>Всього Юридичних осіб: {companies.filter((company) => company.edrpou.toString().length === 8).length}</p>
                <p>Всього платників ПДВ: {companies.filter((company) => company.payerPDW).length}</p>
                <p>Робітників на всіх підприємствах: {companies.reduce((sum, company) => sum += company.numOfWorkers, 0)}</p>
            </div>
        )
        
    }

    return(
        companies 
        ?   <div className='tablesForStat'><Statistics /><WorkersTable /></div>
        :   <div>Пусто...</div>
    )

}

function mapStateToProps(state) {
    return{
        companies: state.companiesInfoReducers.list,
        // licenses: state.companiesInfoReducers.licenses,
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setCompanies: (list) => dispatch(setCompaniesList(list)),
        // setLicenses: (licenses) => dispatch(setCompanyLicenses(licenses)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(StatPage))