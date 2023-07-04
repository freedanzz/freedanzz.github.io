import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';

const IncrementScore = (props) => {
  const counterRef = useRef(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    anime({
      targets: counterRef.current,
      innerHTML: [0, props.targetValue], // Rango de valores inicial y final
      round: 1, // Redondear los valores a 1 decimal
      easing: 'easeInOutCubic', // Función de interpolación lineal para un incremento uniforme
      duration: 2000, // Duración de la animación en milisegundos
    });
  }, []);

  return <span className='valueScore' ref={counterRef}>{counter}</span>;
};

export default IncrementScore;