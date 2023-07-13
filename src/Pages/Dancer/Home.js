import React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, FormControlLabel, FormGroup, LinearProgress, Switch } from '@mui/material';
import Cookies from 'js-cookie';
import CircularProgressAnimation from '../../Utils/CircularAnimation';
import Confetti from 'react-confetti';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Helmet } from 'react-helmet';
import IncrementScore from '../../Utils/Increment';
import moment from 'moment';
import { Navigate } from 'react-router-dom';
import packageJson from '../../../package.json';
import Services from '../../Services/Services';
import { push as Menu } from 'react-burger-menu';
import Tabs from '../../Components/Tabs/Tabs';

const sFirebase = new Services();

class Home extends React.Component {

    state = {
        activeTab: 0,
        dancer: null,
        dancersToday: null,
        topDancerWeek: null,
        topDancersToday: null,
        infoDancer: null
    };

    componentDidMount() {
        this.getValueCookieUser();
        this.getEvaluationToday();
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

    getEvaluationToday = async (dateEva) => {
        this.setState({loading: true});
        const db = await this.getDatabaseFB();
        const dateTransform = new Date(dateEva);
        const getDatePicker =  dateEva !== undefined ? moment(dateTransform).format('DD/MM/YYYY') : moment().format("DD/MM/YYYY");
        let dancerArray = [];
        // FECHA MANUAL DEFINIDA => '10/04/2023'
        const dancers = await sFirebase.getDancersToday(db, getDatePicker);
        dancers.forEach((doc) => {
          dancerArray.push({
            id_dancer: doc.data().id_dancer,
            master: doc.data().master,
            ver: doc.data().ver,
            pun: doc.data().pun,
            res: doc.data().res,
            pas: doc.data().pas,
            rig: doc.data().rig,
            score: (parseInt(doc.data().ver) + parseInt(doc.data().pun) + parseInt(doc.data().res) + parseInt(doc.data().pas) + parseInt(doc.data().rig)) * 100 / 25
          })
        });

        for (let i=0; i < dancerArray.length; i++){
          let danc = await sFirebase.getDancer(db,dancerArray[i].id_dancer);
          dancerArray[i].names = danc.names;
          dancerArray[i].level = danc.level;
        }

        dancerArray.sort((a, b) => a.score > b.score ? -1 : 1);
        const getCurrentDancer = {top: dancerArray.findIndex(d => d.id_dancer == this.state.dancer.user_id) + 1, totalTop: dancerArray.length, ...dancerArray.find(d => d.id_dancer == this.state.dancer.user_id)};
        // console.log("Calificaciones de hoy", getCurrentDancer);
        const dateSelected = dateEva !== undefined ? dateEva : moment();
        const currentDate = moment();
        if(dateSelected.isSame(currentDate, 'day')) {
            // console.log("Si es hoy");
            this.setState({topDancersToday: dancerArray});
        } else {
            // console.log("No es hoy");
        }
        this.setState({dancersToday: getCurrentDancer, loading: false});
    }

    getScoreDancerWeek = async () => {
        this.setState({loading: true});
        const db = await this.getDatabaseFB();
        // AUTOMATIC PROCESS GET EVALUATION DANCERS TO WEEK
        const dayOfWeekName = moment().format('dddd');
        const getDayNumber = moment().day() == 0 ? 7 : moment().day();
        // const getDayNumber = 7;
        // console.log("Dayyyy", dayOfWeekName);
        let arraysDates = [];
        for(let i = 0; i < getDayNumber; i++) {
            // BACK A DAY
            arraysDates.push(`${moment().subtract(i, 'days').format('DD/MM/YYYY')}`);
        }
        // console.log("dates", arraysDates);
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
        // console.log("Bailarines de la semana", dancersWeek);
        // console.log("Posición de bailarín", getCurrentDancer);
        this.setState({infoDancer: getCurrentDancer, topDancerWeek: dancersWeek, loading: false});
    }

    getValueCookieUser = async () => {
        try {
            const dancerSession = Cookies.get('dancer');
            const parseCookieDancer = JSON.parse(dancerSession);
            // console.log('Cookie de bailarín', parseCookieDancer);
            this.setState({dancer: parseCookieDancer});
        } catch (e) {
            // console.log("No hay sesión activa.");
        }
    }

    changeTab = (event, newValue) => {
        this.setState({ activeTab: newValue });
    }

    render() {
        if(Cookies.get('dancer') !== undefined) {
            if(this.state.dancer !== null) {
                let scoresDancer;
                let topWeekDancer;
                let evaluationDancerToday;
                let celebrateConfetti;
                if(this.state.infoDancer === null) {
                    scoresDancer = (
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress color='secondary' />
                    </Box>
                  );
                } else {
                    celebrateConfetti = this.state.infoDancer.top > 0 && this.state.infoDancer.top <= 3 ?
                        <Confetti
                            width={window.innerWidth}
                            height={window.innerHeight}
                            style={{zIndex: 10}}
                            recycle={false}
                            numberOfPieces={500}
                        /> : null;
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
                    );

                    topWeekDancer = (
                        <>
                            <div className={`backMedalTop ${this.state.infoDancer.top > 3 ? 'low' : 'top'}`}>
                                <div>{this.state.infoDancer.top}</div>
                            </div>
                            <div className='textTopWeek'><strong>TOP</strong> de la semana</div>
                        </>
                    );

                    evaluationDancerToday = this.state.dancersToday !== null ? this.state.dancersToday.top > 0 ? (
                        <>
                            <div className='scoresEvaluationToday'>
                                <div className='item'>
                                    <div className='value'>{this.state.dancersToday.ver}</div>
                                    <div className='text'>VER</div>
                                </div>
                                <div className='item'>
                                    <div className='value'>{this.state.dancersToday.pun}</div>
                                    <div className='text'>PUN</div>
                                </div>
                                <div className='item'>
                                    <div className='value'>{this.state.dancersToday.res}</div>
                                    <div className='text'>RES</div>
                                </div>
                                <div className='item'>
                                    <div className='value'>{this.state.dancersToday.pas}</div>
                                    <div className='text'>PAS</div>
                                </div>
                                <div className='item'>
                                    <div className='value'>{this.state.dancersToday.rig}</div>
                                    <div className='text'>RIG</div>
                                </div>
                            </div>
                            <div className='topTodayDancer'>
                                <div className='titleTodayTop'>TOP</div>
                                <div className='top'>#{this.state.dancersToday.top}<span>/ {this.state.dancersToday.totalTop}</span></div>
                            </div>
                        </>
                    ) : ( <div className='emptyDancerToday'>No hay calificaciones para este dia.</div> ) : <div>Cargando...</div>
                }
                return (
                    <>
                        <Helmet>
                            <title>Freedanz | Estudiante</title>
                        </Helmet>
                        <div id="outer-container">
                            <Menu
                                pageWrapId="page-wrap"
                                outerContainerId="outer-container"
                                overlayClassName="menu-overlay"
                            >
                                <div className='profileMenu'>
                                    <div className='dancerImage'>
                                        {/*<img width={36} src={`https://ui-avatars.com/api/?name=${this.state.dancer.names.split(" ").join("+")}`} />*/}
                                        <img width={36} src={this.state.dancer.image} />
                                    </div>
                                    <div className='infoUser'>
                                        <div className='username'>
                                            {this.state.dancer.names} - <span className={'level-'+this.state.dancer.level.toLowerCase()}>{this.state.dancer.level}</span>
                                        </div>
                                        <div className='logout'>
                                            Cerrar sesión
                                        </div>
                                    </div>
                                </div>
                                <div className='FCMCheck'>
                                    <h3>Notificaciones</h3>
                                    <FormGroup>
                                        <FormControlLabel control={<Switch />} label="Recibir notificaciones" />
                                    </FormGroup>
                                    <span className='detail'>Recibiras una notificación de la aplicación cada vez que se te califique.</span>
                                </div>
                                <div className='versionApp'>
                                    <div>
                                        © Copyright 2021 - {moment().format('yyyy')}, Freedanz Cluster Evaluation es un proyecto desarrollado por Freedanz Cluster.
                                    </div>
                                    <div className='version'>
                                        Freedanz Evaluation v{packageJson.version}
                                    </div>
                                </div>
                            </Menu>
                            <main id="page-wrap">
                                <div className='wrapDancer'>
                                    {celebrateConfetti}
                                    <div className='dancerProfile' style={{backgroundImage: `url(${this.state.dancer.image})`}}>
                                        <span className='logout' onClick={() => this.logout()}>Cerrar sesión</span>
                                        {/*<div className='dancerImage'>
                                            <img width={120} src={`https://ui-avatars.com/api/?name=${this.state.dancer.names.split(" ").join("+")}`} />
                                            <img width={120} src={this.state.dancer.image} />
                                        </div>*/}
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
                                        {topWeekDancer}
                                    </div>
                                    <div className='wrapTabs'>
                                        <Tabs currentTab={this.state.activeTab} changeTab={this.changeTab} stateTab={this.state.infoDancer !== null} />
                                        <div className='wrapTabsSelect'>
                                            {this.state.activeTab === 0 &&
                                                <div className='tab-panel panel-1'>
                                                    <div className='evaluationToday'>
                                                        <div className='wrapHeadEvaluationToday'>
                                                            <h3>Mis calificaciones</h3>
                                                            <div className='title'>
                                                                Buscar por fecha
                                                            </div>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DatePicker
                                                                    label="Fecha"
                                                                    format={'DD/MM/YYYY'}
                                                                    defaultValue={dayjs(moment().format('DD/MM/YYYY'),'DD/MM/YYYY')}
                                                                    onChange={(newValue) => {
                                                                        this.getEvaluationToday(newValue);
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                        </div>
                                                        {
                                                            this.state.loading || this.state.infoDancer  === null ?
                                                                <Box sx={{ width: '100%' }}>
                                                                    <LinearProgress color='secondary' style={{marginTop: 10}} />
                                                                </Box> : evaluationDancerToday
                                                        }
                                                    </div>
                                                </div>
                                            }
                                            {
                                            this.state.activeTab === 1 &&
                                                <div className='tab-panel panel-2'>
                                                    {this.state.topDancersToday.length > 0 ?
                                                    <>
                                                        <h3 className='headTitle'>
                                                            Así quedó el <b>Top 10</b> de bailarínes hoy.
                                                        </h3>
                                                        <div className='wrapTopToday'>
                                                            <span>Evaluados por: <b>Laura H | Profesora/Coreografa</b></span>
                                                            <div className='head'>
                                                                <div>TOP</div>
                                                                <div>BAILARÍN</div>
                                                                <div>NIVEL</div>
                                                                <div>VER</div>
                                                                <div>PUN</div>
                                                                <div>RES</div>
                                                                <div>PAS</div>
                                                                <div>RIG</div>
                                                            </div>
                                                            <div className='content'>
                                                                {
                                                                    this.state.topDancersToday.slice(0, 10).map((item, key) => {
                                                                        return (
                                                                            <div className={`item ${item.id_dancer === this.state.infoDancer.id_dancer ? 'currentDancer' : ''}`}>
                                                                                <div>{key + 1}</div>
                                                                                <div>{item.names}</div>
                                                                                <div>{item.level}</div>
                                                                                <div>{item.ver}</div>
                                                                                <div>{item.pun}</div>
                                                                                <div>{item.res}</div>
                                                                                <div>{item.pas}</div>
                                                                                <div>{item.rig}</div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </> :   <div className='message'>
                                                                Las calificaciones del día se cargarán una vez finalizado el ensayo presencial.<br /><br />
                                                                Si quieres ver tus calificaciones en una fecha diferente, ve a la pestaña <b>"Mis calificaciones".</b>
                                                            </div>
                                                    }
                                                </div>
                                            }
                                            {
                                            this.state.activeTab === 2 &&
                                                <div className='tab-panel panel-3'>
                                                    {this.state.topDancerWeek.length > 0 ?
                                                    <>
                                                        <h3 className='headTitle'>
                                                            {moment().format('dddd').toLowerCase() === 'sunday' ? 'Así quedó' : 'Así va'} el <b>Top 10</b> de bailarínes de la semana.
                                                        </h3>
                                                        <div className='wrapTopToday'>
                                                            <span>Evaluados por: <b>Laura H | Profesora/Coreografa</b></span>
                                                            <div className='head'>
                                                                <div>TOP</div>
                                                                <div>BAILARÍN</div>
                                                                <div>NIVEL</div>
                                                                <div>VER</div>
                                                                <div>PUN</div>
                                                                <div>RES</div>
                                                                <div>PAS</div>
                                                                <div>RIG</div>
                                                            </div>
                                                            <div className='content'>
                                                                {
                                                                    this.state.topDancerWeek.slice(0, 10).map((item, key) => {
                                                                        return (
                                                                            <div key={key} className={`item ${item.id_dancer === this.state.infoDancer.id_dancer ? 'currentDancer' : ''}`}>
                                                                                <div>{key + 1}</div>
                                                                                <div>{item.names}</div>
                                                                                <div>{item.level}</div>
                                                                                <div>{item.ver}</div>
                                                                                <div>{item.pun}</div>
                                                                                <div>{item.res}</div>
                                                                                <div>{item.pas}</div>
                                                                                <div>{item.rig}</div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </> :   <div className='message'>
                                                                Las calificaciones del día se cargarán una vez finalizado el esnayo presencial.<br /><br />
                                                                Si quieres ver tus calificaciones en una fecha direrente, ve a la pestaña <b>"Mis calificaciones"</b>
                                                            </div>
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </>
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