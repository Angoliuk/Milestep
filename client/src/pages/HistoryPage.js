import { useHttp } from '../hooks/http.hook'
import { useCallback, useEffect, useState } from "react"
import { NavBar } from '../Components/NavBar'


export const HisotyPage = () => {

    const {request} = useHttp() 

    const [history, setHistory] = useState()

    const dataRequest = useCallback( async () => {
        try {
            const data = await request('/api/auth/staticInfoGet', 'GET', null)
            setHistory(data.find((staticInfo) => staticInfo.name === 'history'))
        } catch (e) {
            console.log(e)
        }
    }, [request])

    // useEffect(() => {
    //     dataRequest()
    // })

    return(
        <div className="container">
            <NavBar />
            <button onClick={dataRequest}> load </button>
            {console.log(history)}
        </div>
    )

}