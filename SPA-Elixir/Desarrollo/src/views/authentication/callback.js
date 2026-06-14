import React, { Component } from "react";
import { useNavigate } from 'react-router-dom';
import authServices from "../../guards/oidc/AuthService";
import {obtenerTokenOAuth} from '../../guards/jwt/JwtContext';

class Callback extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ""
        };
      }

    componentDidMount() {
        let queryParams = window.location.search;
        let params = this.getQueryParams(queryParams);
        this.setState({code: params.code});
      }

        getQueryParams(query) {
        query = query.substring(1); // quitar el '?' del inicio
        var params = {};
        var queryParams = query.split('&');
    
        for (var i = 0; i < queryParams.length; i++) {
            var pair = queryParams[i].split('=');
            var key = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1] || '');
    
            // Verificar si la clave ya existe en el objeto params
            if (params[key]) {
                // Si la clave ya existe, convertir el valor a un array
                if (!Array.isArray(params[key])) {
                    params[key] = [params[key]];
                }
                params[key].push(value);
            } else {
                params[key] = value;
            }
        }
        return params;
    }

     redirectToLogin = () => {
        let navigate = useNavigate();
        navigate('/auth/login', { replace: true });
    }
    
    logout = async () => {
        await obtenerTokenOAuth(this.state.code);
    }
    render() {
        return (
            <div><button onClick={() => this.redirectToLogin()}>Redireccionar al login</button>
            <br></br>
            <button onClick={() => this.logout()}>Logout</button>
            </div>        
        );
      }
}

  export default Callback;
  