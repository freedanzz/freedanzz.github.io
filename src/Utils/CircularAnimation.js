import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const CircularProgressAnimation = (props) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if(props.targetValue > 0) {
        const timer = setInterval(() => {
        setProgress((prevProgress) => {
            const nextProgress = prevProgress + 1;
            return nextProgress > props.targetValue ? props.targetValue : nextProgress;
        });
        }, 20);

        return () => {
        clearInterval(timer);
        };
    }
  }, []);

  return (
      <CircularProgress style={{color: props.customColor}} variant="determinate" value={progress} />
  );
};

export default CircularProgressAnimation;