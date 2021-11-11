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
            setHistory(staticInfo[1])
        } catch (e) {
            console.log(e)
        }
    }, [request])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const TableBlocks = useCallback((info, isTaskBlock) => {

        let infoForEveryMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

        if (info.isTaskBlock) {
            if (info.info) {
                info.info.forEach(task => {
                    let month = new Date(task.date).getMonth()
                    console.log(month)
                    infoForEveryMonth[month]++
                })
            }
        } else {
            infoForEveryMonth = ['Січень', 'Лютий', 'Квітень', 'Березень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
        }

        return (
            infoForEveryMonth.map((task) => {
                return(
                    <th>{task}</th>
                    )            
                })
        )
    }, [])

    const HistoryCompany = () => {

        let listForSearch = []

        chosenCompany
        ?   listForSearch = history.info.filter((company) => company.name === chosenCompany)
        :   listForSearch = history.info


        return(
            listForSearch.map((company) => {

                // const table = {};
                // const res = company.tasksHistory.filter(({task}) => (table[task]) ? table[task]++ : table[task] = 1)

                return(
                    <div className="companyElement">
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
                                            {console.log(task.completeDates)}
                                            <TableBlocks info={task.completeDates} isTaskBlock={true}/>
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

            {(history) ? <HistoryCompany /> : <div>В історії немає інформації про компанію</div>}
            
        </div>
    )

}