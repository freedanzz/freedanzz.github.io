import React from 'react';

import bcrypt from 'bcryptjs';
import Services from '../Services/Services';
import UserLogin from '../Components/Users/Forms/Login';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';

const sFirebase = new Services();
class LoginPage extends React.Component {
    
    state = {
        messageErrorForm: null,
        stateLogin: null // 0 'Fallo' 1 'Exitoso'
    };

    componentDidMount () {
        const hashedPassword = bcrypt.hashSync('1044606498', 10);
        console.log("Pass", hashedPassword);
    }

    getDatabaseFB = async () => {
        const FBConecction = await sFirebase.connectFirebase();
        const db = await sFirebase.connectDatabaseFirebase(FBConecction);
        return db;
    }

    validateLogin = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        const db = await this.getDatabaseFB();
        const user = await sFirebase.getUserLoginDB(db, username);
        let dancersArray = [];
        await user.forEach((doc) => {
            dancersArray.push({
                user_id: doc.id,
                names: doc.data().names,
                level: doc.data().level,
                username: doc.data().username,
                password: doc.data().password
            })
        });

        if(dancersArray.length !== 0) {
            const isPasswordMatch = await bcrypt.compare(password, dancersArray[0].password);
            if (isPasswordMatch) {
                this.setState({messageErrorForm: 'Iniciando sesión...', stateLogin: 1 });
                /**
                 * Create sesion (Cookie) dancer
                 */
                Cookies.set('dancer', JSON.stringify(dancersArray[0]), { expires: 1 });
                // La contraseña coincide, el inicio de sesión es exitoso
                // Realiza las acciones necesarias, como redireccionar al usuario a su perfil, establecer el estado de autenticación, etc.
            } else {
                this.setState({messageErrorForm: 'Contraseña incorrecta, por favor verificar.', stateLogin: 0 });
                // La contraseña no coincide, el inicio de sesión falla
                // Puedes mostrar un mensaje de error al usuario o realizar otras acciones
            }
        } else {
            this.setState({messageErrorForm: 'El usuario que ingresó no existe en nuestra base de datos.' });
        }
        
    }

    render () {
        if(Cookies.get('dancer') == undefined) {
            if(this.state.stateLogin === 1) {
                return (
                    <Navigate to="/home" />
                )
            }
        } else {
            return (
                <Navigate to="/home" />
            );
        }
        return (
            <>
                <Helmet>
                    <title>Freedanz | Ingreso</title>
                </Helmet>
                <UserLogin login={this.validateLogin} messageForm={this.state.messageErrorForm} stateLogin={this.state.stateLogin} />
            </>
        )
    }

}

export default LoginPage;