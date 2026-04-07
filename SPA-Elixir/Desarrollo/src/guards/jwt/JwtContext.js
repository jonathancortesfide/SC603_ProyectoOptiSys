import { createContext, useEffect, useReducer } from 'react';

// utils
import axios from 'src/utils/axios';
import { isValidToken, setSession } from './Jwt';
import {apiLogin, apiRegistroUsuario, apiObtenerTokenOauth} from '../../components/apiConstantes';

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

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get('/api/account/my-account');
          const { user } = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
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
    const params = new URLSearchParams();
  params.append('client_id', 'js');
  params.append('grant_type', 'password');
  params.append('scope', 'openid profile scope2');
  params.append('username', email);
  params.append('password', password);
    const response = await axios.post(apiObtenerTokenOauth, params);
    const { accessTokens } = response.data.access_token;
    const user = '';
    const accessToken = response.data.access_token;
    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const signup = async (email, password, firstName, lastName) => {
    const response = await axios.post(apiRegistroUsuario, {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
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
        signup
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
