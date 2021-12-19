import './components.css'
import { CSSTransition } from 'react-transition-group'
export const Loader = ({loading}) => {
    return (
        <CSSTransition
            in={loading}
            timeout={1000}
            classNames="loaderBlock"
        >
            <div className="loader">
                <div className="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </CSSTransition>
        
    )
}