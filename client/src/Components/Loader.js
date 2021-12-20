import './components.css'
export const Loader = ({loading}) => {
    return (
            <div className="loader">
                <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        
    )
}