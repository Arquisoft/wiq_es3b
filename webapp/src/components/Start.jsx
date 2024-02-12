import reactLogo from '../assets/react.svg'

export const Start = ({ goTo }) => {

    return (

        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={ () => goTo(1) }>
                    Jugar
                </button>
            </div>
        </>
    )
}