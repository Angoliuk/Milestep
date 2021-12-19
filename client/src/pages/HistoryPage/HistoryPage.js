import { useHttp } from '../../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"
import printJS from 'print-js'
import "./HistoryPage.css"
import { setHistory } from '../../reduxStorage/actions/companies'
import { connect } from 'react-redux'
import { Select } from '../../Components/select/Select'
import { Input } from '../../Components/input/Input'
import HistoryOptions from '../../Components/options/HistoryOptions'
import { PagesWrapping } from '../../hoc/PagesWrapping'

function HistoryPage (props) {

    const {request} = useHttp() 
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


    const TableBlocks = useCallback(({info, isTaskBlock}) => {

        let infoForEveryMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        isTaskBlock && info 
        ?   info.forEach(task => {
                if (new Date(task.completeToDate).getFullYear() === Number(historyYear)) {
                    let month = new Date(task.completeToDate).getMonth()
                    infoForEveryMonth[month]++}})
        :   infoForEveryMonth = ['Січень', 'Лютий', 'Квітень', 'Березень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']

        return (
            infoForEveryMonth.map((task, key) => {
                return(
                    <th className='thForHistory' key={key}>{task}</th>
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
            listForSearch
            ?   listForSearch.map((company, key) => {
                    return(
                        <div key={key} className="element">
                            <div id={company.edrpou}>
                                <p>Назва: {company.name}</p>
                                <p>ЄДРПОУ: {company.edrpou}</p>
                                <table className="tableForHistory">
                                    <thead>
                                        <tr>
                                            <th className="thForHistory">Звітність щодо виконання завдань</th>
                                            <TableBlocks isTaskBlock={false} />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {company.tasksHistory.map((task, key) => {
                                            return(
                                                <tr key={key}>
                                                    <th className='thForHistory'>
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
            :   <div>Поки що тут нічого нема</div>
        )
    }


    const historyCompanyHandleChange = (event) => {

        setChosenCompany(event.target.value)
    }

    const historyYearHandleChange = (event) => {

        setHistoryYear(event.target.value)

    }

    return(
        <>

            <Select 
                onChange={historyCompanyHandleChange} 
                value={chosenCompany} 
                name="historyCompany"
                OptionsList={HistoryOptions} 
                label='Компанія' 
            />  

            <Input 
                name='historyYear' 
                onChange={historyYearHandleChange} 
                value={historyYear} 
                htmlFor='Рік'
                type="number"
            />

            {history ? <HistoryCompany /> : <div>В історії немає інформації про компанію</div>}
            
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(HistoryPage))