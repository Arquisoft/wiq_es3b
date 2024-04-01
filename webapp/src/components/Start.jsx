
export const Start = ({ goTo }) => {

    return (

        <>
        <main>
            <h1 className="tituloStart">ASW Quiz - WIQ</h1>
            <div id="start">
                <button onClick={ () => goTo(2) }>
                    Classic Game
                </button>
                <button onClick={ () => goTo(3) }>
                    Infinite Mode
                </button>
                <button onClick={ () => goTo(4) }>
                    One Life Mode
                </button>
                <button onClick={ () => goTo(5) }>
                    Participation
                </button>
            </div>
        </main>
        </>
    )
}