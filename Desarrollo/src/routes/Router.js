import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
import AuthGuard from 'src/guards/authGuard/AuthGuard';
import GuestGuard from 'src/guards/authGuard/GuestGaurd';
import Callback  from '../views/authentication/callback';

/* ****Pages***** */
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
/* ***Pacientes*** */
const Pacientes = Loadable(lazy(() => import('../views/pacientes/Pacientes')));

/* ***Examenes*** */
const Examenes = Loadable(lazy(() => import('../views/examenes/Examenes')));

/* ***Seguridad*** */
const Seguridad = Loadable(lazy(() => import('../views/seguridad/Seguridad')));
/* ***Mantenimientos - Moneda*** */
const Monedas = Loadable(lazy(() => import('../views/mantenimientos/moneda/Monedas')));
/* ***Mantenimientos - Marca*** */
const Marcas = Loadable(lazy(() => import('../views/mantenimientos/marca/Marcas')));
/* ***Mantenimientos - Producto*** */
const Productos = Loadable(lazy(() => import('../views/productos/Productos')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));

const Router = [
  {
    path: '/',
    element: (
      //<AuthGuard>
        <FullLayout />
      //</AuthGuard>
    ),
    children: [
      { path: '/', element: <Navigate to="/sample-page" /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/pacientes', exact: true, element: <Pacientes /> },
      { path: '/examenes', exact: true, element: <Examenes /> },
      { path: '/seguridad', exact: true, element: <Seguridad /> },
      { path: '/mantenimientos/moneda', exact: true, element: <Monedas /> },
      { path: '/mantenimientos/marca', exact: true, element: <Marcas /> },
      { path: '/productos', exact: true, element: <Productos /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
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
