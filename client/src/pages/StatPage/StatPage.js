import { connect } from "react-redux"
import React, { useCallback, useEffect, useState} from "react"
import { useHttp } from '../../hooks/http.hook'
import { setCompaniesList } from "../../reduxStorage/actions/companies"
import printJS from "print-js"
import './StatPage.css'
import { PagesWrapping } from "../../hoc/PagesWrapping/PagesWrapping"
import { Input } from "../../Components/input/Input"
import { Select } from "../../Components/select/Select"
import standartTasksOptions from "../../Components/options/StandartTasksOptions";
import { setStandartTasks } from "../../reduxStorage/actions/tasks"

function StatPage (props) {

    const {request} = useHttp()
    const {companies, setCompanies, alertShowFunc, setStandartTasks} = props
    const [numOfDays, setNumOfDays] = useState(5)
    const [searchTaskName, setSearchTaskName] = useState('')
    const [statTypeChoose, setStatTypeChoose] = useState('tasks')

    const handleChangeInputNumOfDays = (event) => {

        let newNumOfDays = Number(event.target.value)

        newNumOfDays > 735 && newNumOfDays < -1
        ?   setNumOfDays(5)
        :   setNumOfDays(newNumOfDays)

    }

    const handleChangeInputTaskName = (event) => {

        setSearchTaskName(event.target.value)

    }

    const handleChangeStatType = (event) => {

        setStatTypeChoose(event.target.name)

    }

    const dataRequest = useCallback( async () => {
        
        try {
            const data = await request('/api/auth/allCompanies', 'GET', null)
            setCompanies(data)

            const staticInfo = await request('/api/auth/staticInfoGet', 'GET', null)
            staticInfo.find((info) => info.name === 'standartTasks').info.sort((a,b) => a.text.localeCompare(b.text))
            setStandartTasks(staticInfo.find((info) => info.name === 'standartTasks'))
        } catch (e) {
            alertShowFunc({show: true, type:'error', text:'Невдалося завантажити данні'})
        }

    }, [request, setCompanies])

    useEffect(() => {
        dataRequest()
    }, [dataRequest])

    const TasksTable = useCallback(() => {
        let time = new Date()
        time = time.setDate(time.getDate() + numOfDays)
        time = new Date(time)
        return(
            <div className="tasksStatBlock">
                <Input 
                    name='numOfDays' 
                    onChange={handleChangeInputNumOfDays} 
                    value={numOfDays} 
                    htmlFor='Кількість днів'
                    min={-1}
                    max={735}
                    type="number"
                />

                <Select 
                    onChange={handleChangeInputTaskName} 
                    value={searchTaskName} 
                    name="tasksSearch"
                    OptionsList={standartTasksOptions} 
                    label='Завдання' 
                /> 

                <button className='printForStat' onClick={() => {printJS({printable: 'tasksTable', type: 'html', targetStyles: ['*']})}}>Друк</button>
                <table className='tableForStat tasksTable' id="tasksTable">
                    <thead>
                        <tr>
                            <th className='thForStat'>Компанія</th>
                            <th className='thForStat'>ЕДРПОУ</th>
                        </tr>
                    </thead>  
                    <tbody>
                        {companies.map((company) => {
                            const tasksToShow = company.tasks.filter((task) => task.title === searchTaskName && new Date(task.date) <= time) 
                            return(
                            tasksToShow && tasksToShow.length > 0
                            ?   <tr key={company._id}>
                                    <th className='thForStat'>
                                        {company.name}
                                    </th>
                                    <th className='thForStat'>
                                        {company.edrpou}
                                    </th>
                                </tr>
                            :   null
                        )})}
                    </tbody>
                </table>
            </div>
        )
    }, [companies, numOfDays, searchTaskName])

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

    const Statistics = useCallback(() => {

        return(
            <div className="element elementForStat">
                <p>Всього платників: {companies.length}</p>
                <p>Всього ФОПів: {companies.filter((company) => company.edrpou.toString().length === 10).length}</p>
                <p>Всього Юридичних осіб: {companies.filter((company) => company.edrpou.toString().length === 8).length}</p>
                <p>Всього платників ПДВ: {companies.filter((company) => company.payerPDW).length}</p>
                <p>Робітників на всіх підприємствах: {companies.reduce((sum, company) => typeof company.numOfWorkers === 'number' ? sum += company.numOfWorkers : sum, 0)}</p>
            </div>
        )
        
    }, [companies])

    return(
        <div>
            <button className={statTypeChoose === 'tasks' ? 'chosenType' : ''} name="tasks" onClick={handleChangeStatType}>Завдання</button>
            <button className={statTypeChoose === 'workers' ? 'chosenType' : ''} name="workers" onClick={handleChangeStatType}>Робітники</button>
            <button className={statTypeChoose === 'general' ? 'chosenType' : ''} name="general" onClick={handleChangeStatType}>Загальна</button>
            {
                {
                    'tasks': <TasksTable />,
                    'workers': <WorkersTable />,
                    'general': <Statistics />,
                }[statTypeChoose]  
            }
        </div>
        // companies 
        // ?   <div className='tablesForStat'><TasksTable /><WorkersTable /><Statistics /></div>
        // :   <div>Пусто...</div>
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
        setStandartTasks: (standartTasks) => dispatch(setStandartTasks(standartTasks)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PagesWrapping(StatPage))