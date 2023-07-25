import React, { useState, useEffect } from 'react';
import moment from 'moment';

const CountdownTimer = () => {
    const lastDateOfMonth = moment().endOf('month').format('YYYY-MM-DD');
    const targetDate = new Date(lastDateOfMonth); // Fecha objetivo para el contador regresivo
    const [remainingTime, setRemainingTime] = useState(calculateTimeRemaining());

  // Función para calcular el tiempo restante
  function calculateTimeRemaining() {
    const currentTime = new Date();
    const difference = targetDate - currentTime;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  }

  // Actualizar la cuenta regresiva en intervalos regulares
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateTimeRemaining());
    }, 1000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='countDown'>
      <div className='countDown-wrap'>
        <div className='countDown-wrap-title'>QUEDAN</div>
        <div className='countDown-wrap-item'><span>{remainingTime.days}</span>días</div>
        <div className='countDown-wrap-item'><span>{remainingTime.hours}</span>horas</div>
        <div className='countDown-wrap-item'><span>{remainingTime.minutes}</span>minutos</div>
        <div className='countDown-wrap-item'><span>{remainingTime.seconds}</span>segundos</div>
      </div>
    </div>
  );
};

export default CountdownTimer;