
export const Start = ({ goTo }) => {

    return (

        <>
        <main>
            <h1>Quiz ASW</h1>
            <div id="start">
                <button onClick={ () => goTo(2) }>
                    Jugar
                </button>
                <button onClick={ () => goTo(3) }>
                    Participación
                </button>
            </div>
        </main>
        </>
    )
}