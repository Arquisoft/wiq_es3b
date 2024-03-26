
export const Start = ({ goTo }) => {

    return (

        <>
        <main>
            <h1 className="tituloStart">ASW Quiz - WIQ</h1>
            <div id="start">
                <button onClick={ () => goTo(2) }>
                    Play
                </button>
                <button onClick={ () => goTo(3) }>
                    Participation
                </button>
            </div>
        </main>
        </>
    )
}