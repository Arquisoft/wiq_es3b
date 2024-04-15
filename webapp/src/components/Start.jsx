import Divider from '@mui/material/Divider';
import '../css/start.css';
import { FormattedMessage } from 'react-intl';

export const Start = ({ goTo }) => {

    return (

        <>
        <main>
            <h1 className="tituloStart"><span className="fancy">[ ASW Quiz - WIQ ]</span></h1>
            
            <div id="start">
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(2) }><FormattedMessage id="classic" tagName="span" /></button>
                </div>
                <Divider sx={{ border:'2px solid', marginBottom:'0.8em' }} />
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(3) }><FormattedMessage id="infinite" tagName="span" /></button>
                </div>
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(4) }><FormattedMessage id="tlc" tagName="span" /></button>
                </div>
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(5) }><FormattedMessage id="category" tagName="span" /></button>
                </div>
                <div className="button_container">
                    <button className="btn" onClick={ () => goTo(6) }><FormattedMessage id="custom" tagName="span" /></button>
                </div>
                <Divider sx={{ border:'2px solid', marginTop:'0.8em' }} />
                <div className="button_container">
                    <button className="btn"  onClick={ () => goTo(7) }><FormattedMessage id="participation" tagName="span" /></button>
                </div>
            </div>
        </main>
        </>
    )
}