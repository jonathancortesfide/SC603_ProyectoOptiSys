import { createContext, useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

// utils
import axios from 'src/utils/axios';
import axiosBase from 'axios';
import { clearNoEmpresaSeleccionada } from 'src/utils/empresa';
import { clearIdentificadorSucursalSeleccionado } from 'src/utils/sucursal';
import { isValidToken, setSession } from './Jwt';
import {apiLogin, apiRegistroUsuario, apiObtenerTokenOauth} from '../../components/apiConstantes';

// Clean axios instance for the OAuth token endpoint — not affected by shared interceptors
const authAxios = axiosBase.create();

// ----------------------------------------------------------------------

export const obtenerTokenOAuth = async (username, password) => {
  const params = new URLSearchParams();
  params.append('client_id', 'js');
  params.append('grant_type', 'password');
  params.append('scope', 'openid profile scope2');
  params.append('username', username);
  params.append('password', password);
  const response = await axios.post(apiObtenerTokenOauth, params);
  const { accessTokens } = response.data.access_token;
  const user = "";
  const accessToken = response.data.access_token;
  setSession(accessToken);
  dispatch({
    type: 'LOGIN',
    payload: {
      user,
    },
  });
};

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialState,
  platform: 'JWT',
  signup: () => Promise.resolve(),
  signin: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

function  AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          try {
            const response = await axios.get('/api/account/my-account');
            const { user } = response.data || {};

            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: user ?? null,
              },
            });
          } catch (profileError) {
            console.warn('No se pudo cargar el perfil del usuario al reiniciar la sesión, se mantendrá autenticado.', profileError);
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: null,
              },
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const signin = async (email, password, rememberMe) => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });

    const params = new URLSearchParams();
    params.append('client_id', 'js');
    params.append('grant_type', 'password');
    params.append('scope', 'openid profile scope2');
    params.append('username', email);
    params.append('password', password);

    try {
      const response = await authAxios.post(apiObtenerTokenOauth, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const user = '';
      const accessToken = response.data.access_token;
      setSession(accessToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } catch (error) {
      setSession(null);
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    const response = await axios.post(apiRegistroUsuario, {
      email,
      password,
      firstName,
      lastName,
    });
    const accessToken = response.data.accessToken ?? response.data.access_token;
    const user = response.data.user ?? '';

    setSession(accessToken);
    dispatch({
      type: 'REGISTER',
      payload: { user },
    });
    navigate('/resolver-contexto', { replace: true });
  };

  const logout = useCallback(async () => {
    setSession(null);
    clearNoEmpresaSeleccionada();
    clearIdentificadorSucursalSeleccionado();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        signin,
        logout,
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
