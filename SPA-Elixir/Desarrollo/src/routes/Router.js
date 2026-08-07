import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
import AuthGuard from 'src/guards/authGuard/AuthGuard';
import ContextoOperativoGuard from 'src/guards/contextoOperativoGuard/ContextoOperativoGuard';
import GuestGuard from 'src/guards/authGuard/GuestGaurd';
import ProtectedRoute from 'src/guards/permissions/ProtectedRoute';
import Callback  from '../views/authentication/callback';

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const SeleccionEmpresa = Loadable(lazy(() => import('../views/empresa/SeleccionEmpresa')));
const SeleccionSucursal = Loadable(lazy(() => import('../views/empresa/SeleccionSucursal')));
const ResolverContexto = Loadable(lazy(() => import('../views/empresa/ResolverContexto')));
const SinSucursal = Loadable(lazy(() => import('../views/authentication/SinSucursal')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
/* ***Pacientes*** */
const Pacientes = Loadable(lazy(() => import('../views/pacientes/PacientesUnificado')));

/* ***Examenes*** */
const ExamenDeLaVista = Loadable(lazy(() => import('../views/examenes/ExamenVista')));
const VerExamenesDeLaVista = Loadable(lazy(() => import('../views/examenes/ConsultaExamenVista')));

/* ***Seguridad*** */
const Seguridad = Loadable(lazy(() => import('../views/seguridad/Seguridad')));
const UsuariosPendientes = Loadable(lazy(() => import('../views/seguridad/usuariosPendientes/UsuariosPendientes')));
/* ***Mantenimientos - Moneda*** */
const Monedas = Loadable(lazy(() => import('../views/mantenimientos/moneda/Monedas')));
/* ***Mantenimientos - Proveedor*** */
const Proveedores = Loadable(lazy(() => import('../views/mantenimientos/proveedor/Proveedores')));
/* ***Mantenimientos - Enfermedad*** */
const Enfermedades = Loadable(lazy(() => import('../views/mantenimientos/enfermedad/Enfermedades')));
/* ***Mantenimientos - Marca*** */
const Marcas = Loadable(lazy(() => import('../views/mantenimientos/marca/Marcas')));
/* ***Mantenimientos - Lista de precios*** */
const ListasPrecios = Loadable(lazy(() => import('../views/mantenimientos/ListaPrecio/ListasPrecios')));
/* ***Mantenimientos - Tipo de lente*** */
const TipoLente = Loadable(lazy(() => import('../views/mantenimientos/TipoLente/TipoLente')));
/* ***Mantenimientos - Clasificación de pacientes*** */
const ClasificacionPacientes = Loadable(lazy(() => import('../views/mantenimientos/clasificacionPacientes/ClasificacionPacientes')));
/* ***Mantenimientos - Grupos de productos*** */
const GrupoProductos = Loadable(lazy(() => import('../views/mantenimientos/grupoProductos/GrupoProductos')));
/* ***Mantenimientos - Producto*** */
const Productos = Loadable(lazy(() => import('../views/productos/Productos')));
const FacturaPage = Loadable(lazy(() => import('../views/facturacion/FacturaPage')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ActivarCuenta = Loadable(lazy(() => import('../views/authentication/ActivarCuenta')));

const Router = [
  {
    path: '/sin-sucursal',
    element: (
      <AuthGuard>
        <BlankLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <SinSucursal /> }],
  },
  {
    path: '/resolver-contexto',
    element: (
      <AuthGuard>
        <BlankLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <ResolverContexto /> }],
  },
  {
    path: '/seleccion-empresa',
    element: (
      <AuthGuard>
        <BlankLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <SeleccionEmpresa /> }],
  },
  {
    path: '/seleccion-sucursal',
    element: (
      <AuthGuard>
        <BlankLayout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <SeleccionSucursal /> }],
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <ContextoOperativoGuard>
          <FullLayout />
        </ContextoOperativoGuard>
      </AuthGuard>
    ),
    children: [
      { path: '/', element: <SamplePage /> },
      { path: '/sample-page', exact: true, element: <Navigate to="/" replace /> },
      { path: '/pacientes', exact: true, element: <ProtectedRoute requiredPermissions={['PACIENTE_VER']}><Pacientes /></ProtectedRoute> },
      { path: '/crearexamen', exact: true, element: <ProtectedRoute requiredPermissions={['EXAMEN_CREAR']}><ExamenDeLaVista /></ProtectedRoute> },
      { path: '/verexamenes', exact: true, element: <ProtectedRoute requiredPermissions={['EXAMEN_VER']}><VerExamenesDeLaVista /></ProtectedRoute> },
      { path: '/seguridad', exact: true, element: <ProtectedRoute requiredPermissions={['USUARIO_VER']}><Seguridad /></ProtectedRoute> },
      { path: '/seguridad/usuarios-pendientes', exact: true, element: <ProtectedRoute requiredPermissions={['USUARIO_SIN_SUCURSAL_VER']}><UsuariosPendientes /></ProtectedRoute> },
      { path: '/mantenimientos/moneda', exact: true, element: <ProtectedRoute requiredPermissions={['MONEDA_VER']}><Monedas /></ProtectedRoute> },
      { path: '/mantenimientos/proveedor', exact: true, element: <ProtectedRoute requiredPermissions={['PROVEEDOR_VER']}><Proveedores /></ProtectedRoute> },
      { path: '/mantenimientos/enfermedades', exact: true, element: <ProtectedRoute requiredPermissions={['ENFERMEDAD_VER']}><Enfermedades /></ProtectedRoute> },
      { path: '/mantenimientos/marca', exact: true, element: <ProtectedRoute requiredPermissions={['MARCA_VER']}><Marcas /></ProtectedRoute> },
      { path: '/mantenimientos/lista-precio', exact: true, element: <ProtectedRoute requiredPermissions={['LISTA_PRECIO_VER']}><ListasPrecios /></ProtectedRoute> },
      { path: '/mantenimientos/tipo-lente', exact: true, element: <ProtectedRoute requiredPermissions={['TIPO_LENTE_VER']}><TipoLente /></ProtectedRoute> },
      { path: '/mantenimientos/clasificacion-pacientes', exact: true, element: <ProtectedRoute requiredPermissions={['PACIENTE_CLASIFICACION_VER']}><ClasificacionPacientes /></ProtectedRoute> },
      { path: '/mantenimientos/grupos-productos', exact: true, element: <ProtectedRoute requiredPermissions={['GRUPO_PRODUCTO_VER']}><GrupoProductos /></ProtectedRoute> },
      { path: '/productos', exact: true, element: <ProtectedRoute requiredPermissions={['PRODUCTO_VER']}><Productos /></ProtectedRoute> },
      { path: '/facturacion', exact: true, element: <ProtectedRoute requiredPermissions={['FACTURA_VER']}><FacturaPage /></ProtectedRoute> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/activar-cuenta',
    element: <BlankLayout />,
    children: [{ index: true, element: <ActivarCuenta /> }],
  },
  {
    path: '/auth',
    element: (
      <GuestGuard>
        <BlankLayout />
      </GuestGuard>
    ),
    children: [
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/callback', exact: true, element: <Callback /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
