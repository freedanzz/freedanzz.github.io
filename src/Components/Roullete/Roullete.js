import React, { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import imageLogo from '../../Images/logov2.png';

const data = [
    { option: 'Laezly' },
    { option: 'Pipe' },
    { option: 'Ever' },
    { option: 'Devid' },
    { option: 'CardiB' },
    { option: 'Afromaik' },
    { option: 'Sams' },
    { option: 'Andrew' },
    { option: 'ElFresa' },
]

export default (props) => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * data.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }
    const centerImage = <img src={imageLogo} alt="Center Image" />;
    return (
        <>
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={['#2B94F6', '#FF11A3', '#5A008D']}
                outerBorderColor={'#ffffff'}
                radiusLineColor={'#ffffff'}
                textColors={['#ffffff']}
                radiusLineWidth={2}
                fontSize={15}
                onStopSpinning={() => {
                    setMustSpin(false);
                }}
                center={<img src={imageLogo} alt="Center Image" style={{ width: '50px', height: '50px' }} />}
            />
            <div className='roullete__seleected'>{data[prizeNumber].option}</div>
            <button onClick={handleSpinClick}>SPIN</button>
        </>
    )
}