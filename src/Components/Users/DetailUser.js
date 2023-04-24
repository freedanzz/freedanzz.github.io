import React from 'react';
import WP from '../../Images/ico_whatsapp.png';
// import QRCode from 'react-qr-code';
import { QRCode } from 'react-qrcode-logo';

const splitDate = (date) => {
  if(date !== undefined) {
    return date.split("/")[0];
  }
}

const DetailUser = (props) => {
  console.log("Props",props);
  let random = Math.floor(Math.random() * 10000);
  let image = `https://www.gravatar.com/avatar/${random}?s=150&d=identicon`;
  let styles = [];
  if(Object.entries(props.user).length > 0) {
    styles = props.user['¿Que te gustaría aprender?'].split(",");
  }
  let messageUser = `Hola ${props.user['Nombres']},\n Gracias por unirte a esta gran familia, en minutos te escribiremos y seguiremos con tu proceso.`;
  return (
    <div className='detailUser'>
      <div className='image'>
        <img src={image} />
      </div>
      <div className='contentUser'>
        <h2>{props.user['Nombres']} {props.user['Apellidos']}</h2>
        <span>{props.user['Correo electrónico']}</span>
        <div className='genre'>
          Quiere aprender:
          <div className='contentStyles'>
            {styles.map((item, key) => {
              return (
                <span>{item}</span>
              )
            })}
          </div>
        </div>
        <div className='contact' onClick={() => window.open(`https://wa.me/57${props.user['Número de contacto ( Celular )']}?text=${messageUser}`, "_blank")}>
          Escribir <img width="25" src={WP} />
        </div>
        <div>
          Debe pagar los días {splitDate(props.user["Marca temporal"])} de cada mes.
        </div>
        <div style={{marginTop:30}}>
        {/* <QRCode
          value="https://www.instagram.com/free_danzz/"
          ecLevel='H'
          size={500}
          // fgColor='#FFFFFF'
          // bgColor='#000000'
          logoImage='https://scontent.fbog10-1.fna.fbcdn.net/v/t39.30808-6/301027611_111980498294592_3427605454552996829_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_eui2=AeGK2Vkv0qWWxH1aPoP8Pt55KTUCyZ3c9xspNQLJndz3Gz5oijduE_9B_XBZ-nXrI4qE4T5DVaWZdtRud-mFiRBj&_nc_ohc=8bAcODMURpAAX9McQAe&_nc_oc=AQld56Hvb-wlEjex1QPswRZnHXoV1uR10xwgpp5e2qy7OBKbUfosUUNe5HQx79dGH2Cyr9qS4ReWx5NrBTNp8bYr&_nc_ht=scontent.fbog10-1.fna&oh=00_AfDU0dKw-XpUv4gn2SohT4WzJ4w8CNpTAJskwX-D-oZyJA&oe=63B06EE6'
          logoWidth={150}
          logoOpacity='0.8'
          qrStyle='dots'
          eyeRadius={50}
          removeQrCodeBehindLogo={true}
          // eyeColor='#b172db'
          // fgColor='#b172db'
        /> */}
        </div>
      </div>
    </div>
  )
}

export default DetailUser;