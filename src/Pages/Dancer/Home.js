import React from 'react';

import Cookies from 'js-cookie';
import IncrementAnimation from '../../Components/Animation/Increment';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import Services from '../../Services/Services';
import { Box, CircularProgress, LinearProgress } from '@mui/material';
import IncrementScore from '../../Utils/Increment';
import CircularProgressAnimation from '../../Utils/CircularAnimation';

const sFirebase = new Services();

class Home extends React.Component {
    
    state = {
        dancer: null,
        infoDancer: null
    };

    componentDidMount() {
        this.getValueCookieUser();
        this.getScoreDancerWeek();
        
    }

    logout = () => {
        Cookies.remove('dancer');
        window.location.href = '/#/login';
    };

    getDatabaseFB = async () => {
        const FBConecction = await sFirebase.connectFirebase();
        const db = await sFirebase.connectDatabaseFirebase(FBConecction);
        return db;
    }

    totalScoreDancers = (scores) => {
        let total = 0;
        for(let i = 0; i < scores.length; i++) {
            total = parseInt(total) + parseInt(scores[i]);
        }
        // Return porcent range (1-5)
        //return Math.round(total / scores.length);

        return total;
    }

    getScoreDancerWeek = async () => {
        const db = await this.getDatabaseFB();

        // AUTOMATIC PROCESS GET EVALUATION DANCERS TO WEEK
        const dayOfWeekName = moment().format('dddd');
        const getDayNumber = moment().day() == 0 ? 7 : moment().day();
        //const getDayNumber = 8;
        console.log("Dayyyy", dayOfWeekName);
        //let getDayMonth = parseInt(moment().format('DD'));
        let arraysDates = [];
        for(let i = 0; i < getDayNumber; i++) {
            // Back a day
            arraysDates.push(`${moment().subtract(i, 'days').format('DD/MM/YYYY')}`);
            //getDayMonth = getDayMonth - 1;
        }
        console.log("dates", arraysDates);

        let dancersWeek = [];
        for(let i = 0; i < arraysDates.length; i++) {
            const dancers = await sFirebase.getDancersToday(db, arraysDates[i]);
            dancers.forEach((doc) => {
                const existDancer = dancersWeek.findIndex(element => element.id_dancer === doc.data().id_dancer);
                if(existDancer !== -1) {
                    dancersWeek[existDancer].ver = [...dancersWeek[existDancer].ver, doc.data().ver];
                    dancersWeek[existDancer].pun = [...dancersWeek[existDancer].pun, doc.data().pun];
                    dancersWeek[existDancer].res = [...dancersWeek[existDancer].res, doc.data().res];
                    dancersWeek[existDancer].pas = [...dancersWeek[existDancer].pas, doc.data().pas];
                    dancersWeek[existDancer].rig = [...dancersWeek[existDancer].rig, doc.data().rig];
                } else {
                    dancersWeek.push({
                        id_dancer: doc.data().id_dancer,
                        master: doc.data().master,
                        ver: doc.data().ver,
                        pun: doc.data().pun,
                        res: doc.data().res,
                        pas: doc.data().pas,
                        rig: doc.data().rig
                    })
                }
            });
        }
        // ASSIGN NAME DANCERS
        for (let i=0; i < dancersWeek.length; i++){
            let danc = await sFirebase.getDancer(db,dancersWeek[i].id_dancer);
            dancersWeek[i].names = danc.names;
            dancersWeek[i].level = danc.level;
            // ASSIGN SCORES DANCERS
            dancersWeek[i].ver = this.totalScoreDancers(dancersWeek[i].ver);
            dancersWeek[i].pun = this.totalScoreDancers(dancersWeek[i].pun);
            dancersWeek[i].res = this.totalScoreDancers(dancersWeek[i].res);
            dancersWeek[i].pas = this.totalScoreDancers(dancersWeek[i].pas);
            dancersWeek[i].rig = this.totalScoreDancers(dancersWeek[i].rig);
            //dancersWeek[i].score = parseInt(dancersWeek[i].ver) + parseInt(dancersWeek[i].pun) + parseInt(dancersWeek[i].res) + parseInt(dancersWeek[i].pas) + parseInt(dancersWeek[i].rig) * 100 / 125;
            dancersWeek[i].score = parseInt(dancersWeek[i].ver) + parseInt(dancersWeek[i].pun) + parseInt(dancersWeek[i].res) + parseInt(dancersWeek[i].pas) + parseInt(dancersWeek[i].rig);

        }
        dancersWeek.sort((a, b) => a.score > b.score ? -1 : 1);
        const getCurrentDancer = {top: dancersWeek.findIndex(d => d.id_dancer == this.state.dancer.user_id) + 1, ...dancersWeek.find(d => d.id_dancer == this.state.dancer.user_id)};
        console.log("Bailarines de la semana", dancersWeek);
        console.log("Posición de bailarín", getCurrentDancer);
        this.setState({infoDancer: getCurrentDancer});
    }

    getValueCookieUser = async () => {
        try {
            const dancerSession = Cookies.get('dancer');
            const parseCookieDancer = JSON.parse(dancerSession);
            console.log('Cookie de bailarín', parseCookieDancer);
            this.setState({dancer: parseCookieDancer});
        } catch (e) {
            console.log("No hay sesión activa.");
        }
    }

    render() {
        if(Cookies.get('dancer') !== undefined) {
            if(this.state.dancer !== null) {
                let scoresDancer;
                if(this.state.infoDancer === null) {
                    scoresDancer = (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color='secondary' />
                    </Box>
                  );
                } else {
                    scoresDancer = (
                        <>
                            <div className='itemScore'>
                                <div className='score'>
                                    <IncrementScore targetValue={this.state.infoDancer.ver} />
                                    <CircularProgressAnimation customColor='#FF0018' targetValue={(this.state.infoDancer.ver * 100) / 25} />
                                </div>
                                <div className='scoreText'>Versatilidad</div>
                            </div>
                            <div className='itemScore'>
                                <div className='score'>
                                    <IncrementScore targetValue={this.state.infoDancer.pun} />
                                    <CircularProgressAnimation customColor='#FFA52C' targetValue={(this.state.infoDancer.pun * 100) / 25} />
                                </div>
                                <div className='scoreText'>Puntualidad</div>
                            </div>
                            <div className='itemScore'>
                                <div className='score'>
                                    <IncrementScore targetValue={this.state.infoDancer.res} />
                                    <CircularProgressAnimation customColor='#FFFF41' targetValue={(this.state.infoDancer.res * 100) / 25} />
                                </div>
                                <div className='scoreText'>Responsabilidad</div>
                            </div>
                            <div className='itemScore'>
                                <div className='score'>
                                    <IncrementScore targetValue={this.state.infoDancer.pas} />
                                    <CircularProgressAnimation customColor='#008018' targetValue={(this.state.infoDancer.pas * 100) / 25} />
                                </div>
                                <div className='scoreText'>Pasión</div>
                            </div>
                            <div className='itemScore'>
                                <div className='score'>
                                    <IncrementScore targetValue={this.state.infoDancer.rig} />
                                    <CircularProgressAnimation customColor='#0000F9' targetValue={(this.state.infoDancer.rig * 100) / 25} />
                                </div>
                                <div className='scoreText'>Rigurosidad</div>
                            </div>
                        </>
                    )
                }
                return (
                    <div className='wrapDancer'>
                        <div className='dancerProfile'>
                            <span className='logout' onClick={() => this.logout()}>Cerrar sesión</span>
                            <div className='dancerImage'>
                                <img width={150} src={`https://ui-avatars.com/api/?name=${this.state.dancer.names.split(" ").join("+")}`} />
                            </div>
                            <div className='nameDancer'>
                                Hola, {this.state.dancer.names} !
                                <div className='levelDancer'>Bailarín <span className={'level-'+this.state.dancer.level.toLowerCase()}>{this.state.dancer.level}</span></div>
                            </div>
                        </div>
                        <div className='dancerScoreGeneral'>
                            <div className='titleDancer'>
                                Así va tu calificación esta semana !
                            </div>
                            {scoresDancer}
                        </div>
                        <div className='progressWeekDancer'>
                            {/*<CircularProgress variant='determinate' color='secondary' value={70} />*/}
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <Navigate to={'/login'} />
            )
        }
    }

}

export default Home;