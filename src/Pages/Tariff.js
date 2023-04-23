import React from 'react';
import LogoIMG from '../Images/logo.png';
import QRImage from '../Images/qr.png';
import { Helmet } from 'react-helmet';

class Tariff extends React.Component {
  
  componentDidMount() {

  }

  render() {
    return (
      <>
        <Helmet>
          <title>Freedanzz | Tarifas</title>
        </Helmet>
        {/**
         * QR
         */}
        <div className='scanQR'>
          <img width={150} src={QRImage} alt="SCAN QR" />
          <span>[ ESCANEA EL QR ]</span>
        </div>
        <div className="tariffWrap">
          {/**
           * HEAD TARIFF
           */}
          <div className='headTariffWrap'>
            <div>
              <div className="title">TARIFA DE EVENTOS</div>
              <div className='contentDescription'>
                <div className="description">TABLA DE PRECIOS</div>
                <div className="descriptionTwo">Tabla detallada de precios para eventos Freedanzz Cluster</div>
              </div>
            </div>
            <div>
              <div className="title">LEGION</div>
              <div className='contentDescription'>
                <div className="price">$500K COP</div>
                <div className="descriptionPrice">Con bailarines nivel LEGION Freedanzz*</div>
              </div>
            </div>
            <div>
              <div className="title">HALF</div>
              <div className='contentDescription'>
                <div className="price">$400K COP</div>
                <div className="descriptionPrice">Con bailarines nivel HALF Freedanzz*</div>
              </div>
            </div>
            <div>
              <div className="title">BEGINNER</div>
              <div className='contentDescription'>
                <div className="price">$300K COP</div>
                <div className="descriptionPrice">Con bailarines nivel BEGINNER Freedanzz*</div>
              </div>
            </div>
          </div>
          {/**
           * CONTENT TARIFF
           */}
          <div className="contentTariff">
            <div className="item">
              <div class="title">Número de bailarines</div>
              <div class="legion">10</div>
              <div class="half">8</div>
              <div class="beginner">5</div>
            </div>
            <div className="item">
              <div class="title">Tiempo de presentación</div>
              <div class="legion">15</div>
              <div class="half">10</div>
              <div class="beginner">7</div>
            </div>
            <div className="item">
              <div class="title">Incluye show ? (Animación)</div>
              <div class="legion">Si</div>
              <div class="half">No</div>
              <div class="beginner">No</div>
            </div>
            <div className="item">
              <div class="title">Vestuario</div>
              <div class="legion">Si</div>
              <div class="half">Si</div>
              <div class="beginner">Si</div>
            </div>
            <div className="item">
              <div class="title">Transporte</div>
              <div class="legion">Si</div>
              <div class="half">Si</div>
              <div class="beginner">Si</div>
            </div>
          </div>
          {/**
           * TERMS
           */}
          <div className="contentTerms">
            <div>
              <h2>*CONDICIONES DE LAS TARIFAS PARA EVENTOS</h2>
              <div className='item'>
                - El <b>tiempo de presentación</b> según la tarifa escogida puede dividirse en las partes que el cliente desee.<br />
                <b>Ejemplo:</b> 3 o 2 presentaciones de 5 minutos en el mismo evento. <b>(Aplica solo para las tarifas LEGION y HALF)</b>.
              </div>
              <div className='item'>
                - Para concretar el servico, el cliente debe realizar un pago del <b>50% de la tarifa escogida</b><br />
                y el otro 50% al finalizar el evento. <br /><br />
                <b>CUENTAS DE CONSIGNACIÓN:</b><br /><br />
                <b>Nequi o DaviPlata:</b> Laura Hernandez - <b>(319) 518-8231</b><br />
                <b>Cuenta de ahorros Davivienda:</b> Laura Hernandez - <b>48848746990</b>
              </div>
            </div>
            <img width={150} src={LogoIMG} alt="Freedanzz Cluster" />
          </div>
        </div>
      </>
    )
  }

}

export default Tariff;