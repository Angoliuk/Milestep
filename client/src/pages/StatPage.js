import { useCallback, useEffect, useState } from "react"
import { NavBar } from "../Components/NavBar"
import { useHttp } from '../hooks/http.hook'

export const StatPage = () => {

    const {request} = useHttp()

    const [companies, setCompanies] = useState()

    const dataRequest = useCallback( async () => {
        try {

            const data = await request('/api/auth/allCompanies', 'GET', null)
            setCompanies(data)

        } catch (e) {
            console.log(e)
        }
    }, [request])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const Statistics = () => {
        return(
            <div className="companyElement">
                
                <p>Всього платників: {companies.length}</p>
                <p>Всього ФОПів: {companies.filter((company) => company.edrpou.toString().length === 10).length}</p>
                <p>Всього Юридичних осіб: {companies.filter((company) => company.edrpou.toString().length === 8).length}</p>
                <p>Всього платників ПДВ: {companies.filter((company) => company.payerPDW).length}</p>
                <p>Робітників на всіх підприємствах: {companies.reduce((sum, company) => sum += company.numOfWorkers, 0)}</p>
            </div>
        )
    }

    return(
        <div className="container">
            <NavBar />
            {companies ? <Statistics /> : <div>Пусто...</div>}
        </div>
    )

}