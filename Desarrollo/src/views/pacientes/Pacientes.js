import React, { Component } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Avatar,
  AvatarGroup,
  Chip,
  Paper,
  TableContainer,
  Stack,
} from '@mui/material';

import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { basicsTableData } from './tableData';

import ParentCard from '../../components/shared/ParendCard';
import {obtenerListaDePacientes} from '../../requests/pacientes/RequestsPacientes';
import img1 from 'src/assets/images/profile/user-1.jpg';

const basics = basicsTableData;
const BCrumb = [
  {
    title: 'Pacientes',
  }
];

class Pacientes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listaDePacientes: []
        };
      }

    async componentDidMount() {
        await this.obtenerListaDePacientes();
      }

      obtenerListaDePacientes = async () => {
        let laListaDePacientes = await obtenerListaDePacientes();
        this.setState({listaDePacientes: laListaDePacientes});
      }
      render() {
        return (
            <PageContainer title="Pacientes" description="Esta es la vista de pacientes">
            {/* breadcrumb */}
            <Breadcrumb title="Pacientes" items={BCrumb} />
            {/* end breadcrumb */}
            <ParentCard title="Pacientes">
              <Paper variant="outlined">
                <TableContainer >
                  <Table
                    aria-label="Pacientes"
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6">Paciente</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Email</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Teléfono</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6">Género</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.listaDePacientes.map((paciente) => (
                        <TableRow key={paciente.numeroDePaciente}>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <Avatar src={img1} alt={img1} width="35" />
                              <Box>
                                <Typography variant="h6" fontWeight="600">
                                  {paciente.nombre}
                                </Typography>
                                <Typography color="textSecondary" variant="subtitle2">
                                  {paciente.cedula}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                              {paciente.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                          <Typography color="textSecondary" variant="h6" fontWeight="400">
                              {paciente.telefono1}
                            </Typography>
                          </TableCell>
                          <TableCell>
                          <Typography color="textSecondary" variant="h6" fontWeight="400">
                              {paciente.sexo}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </ParentCard>
          </PageContainer> 
        );
      }
}

export default Pacientes;
