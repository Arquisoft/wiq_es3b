
import "../css/Start.css"

const LIMIT_QUESTIONS = 10

export const Start = ({ goTo }) => {

    return (

        <>
        <main>
            <h1>Quiz ASW</h1>
            <div className="card">
                <button onClick={ () => goTo(2) }>
                    Jugar
                </button>
            </div>
        </main>
        </>
    )
}