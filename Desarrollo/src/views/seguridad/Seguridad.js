import React, { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Container,
    Alert,
} from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full/shared/breadcrumb/Breadcrumb';
import ParentCard from '../../components/shared/ParentCard';
import ListadoUsuarios from './usuarios/ListadoUsuarios';
import ListadoRoles from './roles/ListadoRoles';
import AsignarPermisos from './permisos/AsignarPermisos';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

const Seguridad = () => {
    const [tabValue, setTabValue] = useState(0);
    const isMock = import.meta.env.VITE_USE_MOCK === 'true';

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <PageContainer title="Seguridad" description="Gestión de usuarios, roles y permisos">
            <Container>
                {isMock && (
                    <Box mb={2}>
                        <Alert severity="info">Modo MOCK activo — los datos vienen de <code>ejemplosDatos.js</code></Alert>
                    </Box>
                )}
                <Breadcrumb title="Seguridad" subtitle="Gestión de usuarios, roles y permisos" />

                <ParentCard title="Gestión de Seguridad">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="security tabs"
                            variant="fullWidth"
                        >
                            <Tab label="Usuarios" id="tab-0" aria-controls="tabpanel-0" />
                            <Tab label="Roles" id="tab-1" aria-controls="tabpanel-1" />
                            <Tab label="Asignar Permisos" id="tab-2" aria-controls="tabpanel-2" />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <ListadoUsuarios />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <ListadoRoles />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <AsignarPermisos />
                    </TabPanel>
                </ParentCard>
            </Container>
        </PageContainer>
    );
};

export default Seguridad;
