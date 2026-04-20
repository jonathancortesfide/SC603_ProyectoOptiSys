import { createContext, useEffect, useReducer } from 'react';

// utils
import axios from 'axios';
import {
  ACCESS_TOKEN_KEY,
  clearSession,
  getStoredUser,
  getUserFromToken,
  isValidToken,
  registerAuthInterceptors,
  setSession,
} from './Jwt';
import { apiAutenticacionLogin } from '../../components/apiConstantes';

// ----------------------------------------------------------------------

const normalizarRespuestaAuth = (data) => ({
  esCorrecto: data?.esCorrecto ?? data?.EsCorrecto ?? false,
  mensaje: data?.mensaje ?? data?.Mensaje ?? 'No se pudo iniciar sesión.',
  data: data?.data ?? data?.Data ?? null,
});

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
  signin: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

function  AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    registerAuthInterceptors();

    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);

        if (accessToken && isValidToken(accessToken)) {
          const user = getStoredUser() || getUserFromToken(accessToken);
          setSession(accessToken, user);

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          clearSession();
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

  const signin = async (nombreUsuario, password) => {
    const response = await axios.post(apiAutenticacionLogin, {
      nombreUsuario,
      contraseña: password,
    });

    const resultado = normalizarRespuestaAuth(response.data);
    if (!resultado.esCorrecto || !resultado.data?.token) {
      throw new Error(resultado.mensaje || 'Usuario o contraseña incorrectos.');
    }

    const user = {
      noUsuario: resultado.data.noUsuario,
      nombreUsuario: resultado.data.nombreUsuario,
      correo: resultado.data.correo,
    };

    const accessToken = resultado.data.token;
    setSession(accessToken, user);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });

    return resultado;
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        signin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
