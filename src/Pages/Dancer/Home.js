import Cookies from 'js-cookie';
import React from 'react';

class Home extends React.Component {
    
    state = {
        dancer: null
    };

    componentDidMount() {
        this.getValueCookieUser();
    }

    getValueCookieUser = async () => {
        const dancerSession = Cookies.get('dancer');
        const parseCookieDancer = JSON.parse(dancerSession);
        console.log('Cookie de bailarín', JSON.parse(dancerSession));
        this.setState({dancer: parseCookieDancer});
    }

    render() {
        if(this.state.dancer !== null) {
            return (
                <div className='wrapDancer'>
                    <div>Hola, {this.state.dancer.names}!</div>
                    <div className='dancerProfile'>
                        
                    </div>
                </div>
            )
        }
    }

}

export default Home;