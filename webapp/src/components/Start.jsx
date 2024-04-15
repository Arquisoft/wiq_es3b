import Divider from '@mui/material/Divider';
import '../css/start.css';

export const Start = ({ goTo }) => {

    return (

        <>
        <main>
            <h1 className="tituloStart"><span className="fancy">[ ASW Quiz - WIQ ]</span></h1>
            
            <div id="start">
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(2) }><span>Classic Game</span></button>
                </div>
                <Divider sx={{ border:'2px solid', marginBottom:'0.8em' }} />
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(3) }><span>Infinite Mode</span></button>
                </div>
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(4) }><span>Three Lifes Classic</span></button>
                </div>
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(5) }><span>Category Mode</span></button>
                </div>
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(6) }><span>Custom Mode</span></button>
                </div>
                <Divider sx={{ border:'2px solid', marginTop:'0.8em' }} />
                <div className="button_container">
                    <button className="btn"  onClick={ () => goTo(7) }><span>Participation</span></button>
                </div>
            </div>
        </main>
        </>
    )
}