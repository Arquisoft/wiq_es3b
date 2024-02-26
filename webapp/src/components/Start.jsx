import reactLogo from '../assets/react.svg'
import "../css/Start.css"

const LIMIT_QUESTIONS = 10

export const Start = ({ goTo }) => {

    return (

        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Quiz ASW</h1>
            <div className="card">
                <button onClick={ () => goTo(2) }>
                    Jugar
                </button>
            </div>
        </>
    )
}