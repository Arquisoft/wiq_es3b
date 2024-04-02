
import Divider from '@mui/material/Divider';

export const Start = ({ goTo }) => {

    return (

        <>
        <main>
            <h1 className="tituloStart">ASW Quiz - WIQ</h1>
            <div id="start">
                <button onClick={ () => goTo(2) }>
                    Classic Game
                </button>
                <Divider sx={{ border:'2px solid', marginBottom:'1em' }} />
                <button onClick={ () => goTo(3) }>
                    Infinite Mode
                </button>
                <button onClick={ () => goTo(4) }>
                    One Life Mode
                </button>
                <button onClick={ () => goTo(5) }>
                    Category Mode
                </button>
                <Divider sx={{ border:'2px solid', marginTop:'1em' }} />
                <button onClick={ () => goTo(6) }>
                    Participation
                </button>
            </div>
        </main>
        </>
    )
}