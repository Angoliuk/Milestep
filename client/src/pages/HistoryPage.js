import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"
import NavBar from '../Components/NavBar'
import printJS from 'print-js'
import "./pages.css"
import { setHistory } from '../reduxStorage/actions/companies'
import { connect } from 'react-redux'

function HistoryPage (props) {

    const {request} = useHttp() 
    // const [history, setHistory] = useState()
    const [chosenCompany, setChosenCompany] = useState('')
    const [historyYear, setHistoryYear] = useState(new Date().getFullYear())
    const {history, setHistory} = props


    const dataRequest = useCallback( async () => {

        try {
            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            staticInfo.find((info) => info.name === 'history').info.sort((a,b) => a.name.localeCompare(b.name))
            setHistory(staticInfo.find((info) => info.name === 'history'))
        } catch (e) {
            console.log(e)
        }

    }, [request, setHistory])


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
            infoForEveryMonth.map((task, key) => {
                return(
                    <th key={key}>{task}</th>
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
            listForSearch.map((company, key) => {
                return(
                    <div key={key} className="companyElement">
                        <div id={company.edrpou}>
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
                                    {company.tasksHistory.map((task, key) => {
                                        return(
                                            <tr key={key}>
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
                        <button onClick={() => {printJS({printable: company.edrpou, type: 'html', targetStyles: ['*']})}}>
                            Друк
                        </button>
                    </div>
                )
            })
        )
    }


    const historyCompanyHandleChange = (event) => {

        setChosenCompany(event.target.value)
    }

    const historyYearHandleChange = (event) => {

        setHistoryYear(event.target.value)

    }

    return(
        <div className="container">
            <NavBar />
            <div>
                <select onChange={historyCompanyHandleChange} value={chosenCompany} className="selectSearchInput" name="historyCompany" id="historyCompany">
                        <option value=''>Всі компанії</option>

                        {(history && history.info)
                        ?   history.info.map((company, key) => {
                                return (
                                    <option key={key} value={company.name}>{company.name}</option>
                                )})
                        :   <option value=''>Історія ваших компаній пуста</option>
                        }
                </select>
                <label htmlFor="historyCompany">Компанія</label>
            </div>
            <div>
                <input onChange={historyYearHandleChange} value={historyYear} min={2020} className="searchInput" name="historyYear" id="historyYear" type="number"/>
                <label htmlFor="historyYear">Рік</label>
            </div>

            {history ? <HistoryCompany /> : <div>В історії немає інформації про компанію</div>}
            
        </div>
    )

}

function mapStateToProps(state) {
    return{
        history: state.companiesInfoReducers.history
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setHistory: history => dispatch(setHistory(history))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPage)