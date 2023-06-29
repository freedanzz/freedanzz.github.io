import React from 'react';
import SaveEvaluation from '../Components/Dancers/SaveEvaluation';
// import SaveDancer from '../Components/Dancers/SaveDancer';
import Services from '../Services/Services';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import dayjs from 'dayjs';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

const sFirebase = new Services();

class Evaluation extends React.Component {

  state = {
    db: null,
    dancers: null,
    success: false,
    successEva: false,
    dancersToday: null,
    dancersWeek: null,
    loading: false,
    loadingWeek: false,
    dateEva: null
  };

  async componentDidMount() {
    this.getDancers();
    this.getEvaluationToday(null);
    // this.getEvaluationWeek();
  }

  getDatabaseFB = async () => {
    const FBConecction = await sFirebase.connectFirebase();
    const db = await sFirebase.connectDatabaseFirebase(FBConecction);
    return db;
  }

  getDancers =  async () => {
    const db = await this.getDatabaseFB();
    const dancers = await sFirebase.getDancersDB(db);
    let dancersArray = [];
    await dancers.forEach((doc) => {
      dancersArray.push({
        user_id: doc.id,
        names: doc.data().names,
        level: doc.data().level
      })
    });
    this.setState({dancers:dancersArray});
  }

  handleSaveDancer = async (event) => {
    event.preventDefault();
    const db = await this.getDatabaseFB();
    const data = {
      names: event.target.names.value,
      level: event.target.level.value
    };
    try {
      await sFirebase.addUserDB(db, data.names, data.level);
      this.setState({success: true});
      setTimeout(() => {
        this.setState({success: false});
      },1000);
    } catch(e) {
      console.log("Error al guardar Bailarín", e);
    }
    
    event.target.names.value = '';
    event.target.level.value = '';

  }

  handleSaveEvaluation = async (event) => {
    event.preventDefault();
    const db = await this.getDatabaseFB();
    const date =  moment().format("DD/MM/YYYY");
    const data = {
      id_dancer: event.target.id_dancer.value,
      master: event.target.master.value,
      date: date,
      ver: event.target.ver.value,
      pun: event.target.pun.value,
      res: event.target.res.value,
      pas: event.target.pas.value,
      rig: event.target.rig.value
    };
    try {
      await sFirebase.addEvaluationDB(db, data);
      this.setState({successEva: true});
      setTimeout(() => {
        this.setState({successEva: false});
      },1000);
    } catch(e) {
      console.log("Error", e);
    }
  }

  getEvaluationToday = async (dateEva) => {
    this.setState({loading: true});
    const db = await this.getDatabaseFB();
    const dateTransform = new Date(dateEva);
    const getDatePicker =  dateEva !== null ? moment(dateTransform).format('DD/MM/YYYY') : moment().format("DD/MM/YYYY");
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

    this.setState({dancersToday: dancerArray, loading: false});
  }

  getEvaluationWeek = async () => {
    // AUTOMATIC PROCESS GET EVALUATION DANCERS TO WEEK
    const getDayNumber = moment().day();
    let getDayMonth = parseInt(moment().format('DD'));
    let arraysDates = [];
    for(let i = 0; i < getDayNumber; i++) {
      arraysDates.push(`${getDayMonth}/${moment().format('MM/YYYY')}`);
      getDayMonth = getDayMonth - 1;
    }
    console.log("Días de la semana que ya pasaron", arraysDates.sort());
  }

  totalScoreDancers = (scores) => {
    let total = 0;
    for(let i = 0; i < scores.length; i++) {
      total = parseInt(total) + parseInt(scores[i]);
    }
    return Math.round(total / scores.length);
  }

  getDatesRangeEvaluation = async (start, end) => {
    this.setState({loadingWeek: true});
    const db = await this.getDatabaseFB();
    if(end !== null) {
      let startDate = new Date(start);
      let endDate = new Date(end);
      const date = new Date(startDate.getTime());
      const dates = [];
      while (date <= endDate) {
        dates.push(moment(new Date(date)).format('DD/MM/YYYY'));
        date.setDate(date.getDate() + 1);
      }
      let dancersWeek = [];
      for(let i = 0; i < dates.length; i++) {
        const dancers = await sFirebase.getDancersToday(db, dates[i]);
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
        dancersWeek[i].score = Math.round(parseInt(dancersWeek[i].ver) + parseInt(dancersWeek[i].pun) + parseInt(dancersWeek[i].res) + parseInt(dancersWeek[i].pas) + parseInt(dancersWeek[i].rig) * 100 / 125);
      }

      console.log("Array dates", dancersWeek);
      this.setState({dancersWeek: dancersWeek, loadingWeek: false});
    }
  }

  render() {
    let dancersToday;
    let master;
    let dancersWeek;
    if(!this.state.loading) {
      if (this.state.dancersToday !== null) {
        if(this.state.dancersToday.length > 0) {
          master = (this.state.dancersToday[0]!==undefined) ? this.state.dancersToday[0].master : 'No se ha calificado.';
          dancersToday = this.state.dancersToday.sort((a, b) => a.score > b.score ? -1 : 1).map((item, key) => {
            return (
              <div className='item'>
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
          });
        } else {
          dancersToday = <div>El profesor aún no ha cargado la evaluación para este día.</div>;
          master = 'No se ha calificado aún.'
        }
      }
    } else {
      dancersToday = <div>Cargando...</div>;
    }

    /**
     * TOP WEEK DANCERS
     */
    if(!this.state.loadingWeek) {
      if (this.state.dancersWeek !== null) {
        dancersWeek = this.state.dancersWeek.sort((a, b) => a.score > b.score ? -1 : 1).map((item, key) => {
          return (
            <div className='item' key={key}>
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
        });
      } else {
        dancersWeek = <div>Selecciona las fechas para ver el top de bailarines de la semana.</div>;
      }
    } else {
      dancersWeek = <div>Cargando...</div>;
    }
    return (
    <>
      <Helmet>
        <title>Freedanzz | Evaluación</title>
      </Helmet>
      <div className="wrapDancers">
        <div className="wrapLeft">
          <div className='wrapTopToday'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de evaluación"
                format={'DD/MM/YYYY'}
                defaultValue={dayjs(moment().format('DD/MM/YYYY'),'DD/MM/YYYY')}
                onChange={(newValue) => {
                  this.getEvaluationToday(newValue);
                }}
              />
            </LocalizationProvider>
            <h2>TOP BAILARINES DEL DÍA</h2>
            <span>Evaluados por: <b>{master}</b></span>
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
              {dancersToday}
            </div>
          </div>
          {/*<SaveDancer state={this.state.success} saveDancer={this.handleSaveDancer} dancersToday={this.state.dancersToday} />*/}
          <div className="wrapTopDancers">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateRangePicker localeText={{ start: 'Desde', end: 'Hasta' }} onChange={(newDate) => {
                this.getDatesRangeEvaluation(newDate[0], newDate[1]);
              }} />
            </LocalizationProvider>
            <h2>TOP BAILARINES DE LA SEMANA</h2>
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
              {dancersWeek}
            </div>
          </div>
        </div>
        <SaveEvaluation state={this.state.successEva} dancers={this.state.dancers} saveScores={this.handleSaveEvaluation} />
      </div>
      </>
    )
  }

}

export default Evaluation;