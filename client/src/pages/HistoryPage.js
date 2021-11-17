import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"
import { NavBar } from '../Components/NavBar'
import printJS from 'print-js'
import "./pages.css"

export const HistoryPage = () => {

    const {request} = useHttp() 
    const [history, setHistory] = useState()
    const [chosenCompany, setChosenCompany] = useState('')
    const [historyYear, setHistoryYear] = useState(new Date().getFullYear())


    const dataRequest = useCallback( async () => {

        try {
            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            setHistory(staticInfo.find((info) => info.name === 'history'))
        } catch (e) {
            console.log(e)
        }

    }, [request])


    useEffect(() => {
        dataRequest()
    }, [dataRequest])


    const TableBlocks = useCallback((info, isTaskBlock) => {

        let infoForEveryMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        info.isTaskBlock && info.info 
        ?   info.info.forEach(task => {
                if (new Date(task.completeToDate).getFullYear() === Number(historyYear)) {
                    let month = new Date(task.completeToDate).getMonth()
                    infoForEveryMonth[month]++}})
        :   infoForEveryMonth = ['Січень', 'Лютий', 'Квітень', 'Березень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']

        return (
            infoForEveryMonth.map((task) => {
                return(
                    <th>{task}</th>
                    )            
                })
        )
    }, [historyYear])


    const HistoryCompany = () => {

        let listForSearch = []

        chosenCompany
        ?   listForSearch = history.info.filter((company) => company.name === chosenCompany)
        :   listForSearch = history.info

        return(
            listForSearch.map((company) => {

                return(
                    <div className="companyElement">
                        <div id='PrintTable'>
                            <p>Назва: {company.name}</p>
                            <p>ЄДРПОУ: {company.edrpou}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Звітність щодо виконання завдань</th>
                                        <TableBlocks isTaskBlock={false} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {company.tasksHistory.map((task) => {
                                        return(
                                            <tr>
                                                <th>
                                                    {task.task}
                                                </th>
                                                <TableBlocks info={task.completeDates} isTaskBlock={true}/>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => {printJS({printable: 'PrintTable', type: 'html', targetStyles: ['*']})}}>
                            Друк
                        </button>
                    </div>
                )
            })
        )
    }


    const chosenCompanyHandleChange = (event) => {

        setChosenCompany(event.target.value)
    }

    const historyYearHandleChange = (event) => {

        setHistoryYear(event.target.value)

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
            <input onChange={historyYearHandleChange} value={historyYear} min={2020} className="inputForCreate" name="historyYear" id="historyYear" type="number"/>

            {history ? <HistoryCompany /> : <div>В історії немає інформації про компанію</div>}
            
        </div>
    )

}