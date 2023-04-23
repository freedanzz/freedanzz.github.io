import React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

const SaveDancer = (props) => {
  return (
    <>
      <form onSubmit={props.saveDancer}>
        <h2>GUARDAR BAILARÍN</h2>
        <div className='itemForm'>
          <TextField className='Inputs' size="medium" id="names" label="Nombres" variant="outlined" />
        </div>
        <div className='itemForm'>
          <TextField
            id="level"
            select
            label="Nivel"
            name='level'
            className='Inputs'
          >
              <MenuItem key="LEGION" value="LEGION">
                Legion
              </MenuItem>
              <MenuItem key="HALF" value="HALF">
                Half
              </MenuItem>
              <MenuItem key="BEGINNER" value="BEGINNER">
                Beginner
              </MenuItem>
          </TextField>
        </div>
        <Button variant="contained" type='submit' disabled={props.state ? true : false} endIcon={<SendIcon />}>{props.state ? 'Guardado!' : 'Guardar'}</Button>
      </form>
    </>
  )
}

export default SaveDancer;