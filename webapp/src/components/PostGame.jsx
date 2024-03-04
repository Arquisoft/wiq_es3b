import { Card, Typography } from "@mui/material"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const PostGame = () => {

    return (

        <main>
        <div>
            <Typography sx={{ textAlign: 'center' }}>Fin del juego</Typography>
            <Card>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
          
                        <TableRow key={"Preguntas acertadas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>Preguntas acertadas</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>

                        <TableRow key={"Preguntas falladas"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>Preguntas falladas</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>

                        <TableRow key={"Tiempo usado"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>Tiempo usado</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>

                        <TableRow key={"Tiempo restante"} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>Tiempo restante</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
          
                    </TableBody>
                </Table>
            </TableContainer>
            </Card>
        </div>
        </main>
    )
}