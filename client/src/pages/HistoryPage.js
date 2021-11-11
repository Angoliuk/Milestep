import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"
import { NavBar } from '../Components/NavBar'
import "./pages.css"


export const HisotyPage = () => {

    const {request} = useHttp() 

    const [history, setHistory] = useState()

    const [chosenCompany, setChosenCompany] = useState('')

    const dataRequest = useCallback( async () => {
        try {
            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            setHistory(staticInfo.find((info) => info.name === 'history'))
        } catch (e) {
            console.log(e)
        }
    }, [request])

    // useEffect(() => {
    //     dataRequest()
    // })

    const HistoryCompany = () => {

        let listForSearch = []

        chosenCompany
        ?   listForSearch = history.info.filter((company) => company.name === chosenCompany)
        :   listForSearch = history.info


        return(
            listForSearch.map((company) => {

                // company.tasksHistory

                // tasksForTable = []

                const table = {};
                console.log(table)
                const res = company.tasksHistory.filter(({task}) => (!table[task] && (table[task] = 1)));
                console.log(res)

                // {
                //     task: name,
                //     Repeats: [0,0,0,0,0,0,0,0,0,0,0,0]
                // }

                return(
                    <div className="companyElement">
                        <p>Назва: {company.name}</p>
                        <p>ЄДРПОУ: {company.edrpou}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Звітність щодо виконання завдань</th>
                                </tr>
                            </thead>
                            <tbody>
                                {company.tasksHistory.map((task) => {
                                    return(
                                        <tr>
                                            <td>
                                                {task.task}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            })
        )
    }

    const chosenCompanyHandleChange = (event) => {
        setChosenCompany(event.target.value)
    }

    return(
        <div className="container">
            <NavBar />
            <select onChange={chosenCompanyHandleChange} value={chosenCompany} className="selectSearchInput" name="companiesSearch" id="companiesSearch">
                    <option value=''>Всі компанії</option>

                    {(history && history.info)
                    ?   history.info.map((company) => {
                            return (
                                <option value={company.name}>{company.name}</option>
                            )})
                    :   <option value=''>Історія ваших компаній пуста</option>
                    }
            </select>

            <button onClick={dataRequest}>ijsd</button>
            {(history) ? <HistoryCompany /> : <div>В історії немає інформації про компанію</div>}
            
        </div>
    )

}