import { Card, Typography } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const PostGame = ({ gameMode }) => {

    const formatTiempo = (segundos) => {
        const minutos = Math.floor((segundos % 3600) / 60);
        const segs = segundos % 60;
        return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
    };

    return (

        <div>
            <Typography sx={{ textAlign: 'center', fontSize:'2em', margin:'2em 0 0.3em 0 !important' }}>Fin del juego</Typography>
            <Card>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
          
                        <TableRow key={"Preguntas acertadas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Preguntas acertadas</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{localStorage.getItem("pAcertadas")}</TableCell>
                        </TableRow>

                        { gameMode !== "onlyOneLife" ?
                        <TableRow key={"Preguntas falladas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Preguntas falladas</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{localStorage.getItem("pFalladas")}</TableCell>
                        </TableRow>
                        : ""}
                        <TableRow key={"Tiempo usado"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Tiempo usado</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{formatTiempo(localStorage.getItem("tiempoUsado"))}</TableCell>
                        </TableRow>

                        { gameMode === "classic" || gameMode === "category" ?
                        <TableRow key={"Tiempo restante"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell sx={{ fontSize:'1.2em' }}>Tiempo restante</TableCell>
                            <TableCell sx={{ fontSize:'1.2em' }} align="right">{formatTiempo(localStorage.getItem("tiempoRestante"))}</TableCell>
                        </TableRow>
                        : ""}
          
                    </TableBody>
                </Table>
            </TableContainer>
            </Card>
        </div>
    )
}