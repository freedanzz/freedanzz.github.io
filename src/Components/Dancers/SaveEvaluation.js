import React from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

const SaveEvaluation = (props) => {
  let dancersList;
  if(props.dancers !== null) {
    dancersList = (
      props.dancers.map(item => {
        return (
        <MenuItem key={item.user_id} value={item.user_id}>
          {item.names} - {item.level}
        </MenuItem>
        )
      })
    )
  } else {
    <MenuItem key="CARGANDO" value="CARGANDO">
      CARGANDO...
    </MenuItem>
  }
  return (
    <form onSubmit={props.saveScores}>
      <h2>PROCESO DE BAILARÍN</h2>
      <div className='itemForm'>
        <div className='itemForm'>
          <TextField
            id="master"
            select
            label="Profesor"
            name='master'
            className='Inputs'
          >
            <MenuItem key="Laura H." value="Laura H.">Laura H.</MenuItem>
            <MenuItem key="Jaider C." value="Jaider C.">Jaider C.</MenuItem>
            <MenuItem key="Andrés R." value="Andrés R.">Andrés R.</MenuItem>
          </TextField>
        </div>
        <TextField
          id="id_dancer"
          select
          label="Bailarín"
          name='id_dancer'
          className='Inputs'
        >
          {dancersList}
        </TextField>
      </div>
      <h2>SISTEMA DE PUNTUACIÓN</h2>
      <div className='itemForm scores'>
      <TextField
          id="ver"
          select
          label="Versatilidad"
          name='ver'
          className='Inputs'
        >
          <MenuItem key="1" value="1">1</MenuItem>
          <MenuItem key="2" value="2">2</MenuItem>
          <MenuItem key="3" value="3">3</MenuItem>
          <MenuItem key="4" value="4">4</MenuItem>
          <MenuItem key="5" value="5">5</MenuItem>
        </TextField>
        <TextField
          id="pun"
          select
          label="Puntualidad"
          name='pun'
          className='Inputs'
        >
          <MenuItem key="1" value="1">1</MenuItem>
          <MenuItem key="2" value="2">2</MenuItem>
          <MenuItem key="3" value="3">3</MenuItem>
          <MenuItem key="4" value="4">4</MenuItem>
          <MenuItem key="5" value="5">5</MenuItem>
        </TextField>
        <TextField
          id="res"
          select
          label="Responsabilidad"
          name='res'
          className='Inputs'
        >
          <MenuItem key="1" value="1">1</MenuItem>
          <MenuItem key="2" value="2">2</MenuItem>
          <MenuItem key="3" value="3">3</MenuItem>
          <MenuItem key="4" value="4">4</MenuItem>
          <MenuItem key="5" value="5">5</MenuItem>
        </TextField>
        <TextField
          id="pas"
          select
          label="Pasión"
          name="pas"
          className='Inputs'
        >
          <MenuItem key="1" value="1">1</MenuItem>
          <MenuItem key="2" value="2">2</MenuItem>
          <MenuItem key="3" value="3">3</MenuItem>
          <MenuItem key="4" value="4">4</MenuItem>
          <MenuItem key="5" value="5">5</MenuItem>
        </TextField>
        <TextField
          id="rig"
          select
          label="Rigurosidad"
          name='rig'
          className='Inputs'
        >
          <MenuItem key="1" value="1">1</MenuItem>
          <MenuItem key="2" value="2">2</MenuItem>
          <MenuItem key="3" value="3">3</MenuItem>
          <MenuItem key="4" value="4">4</MenuItem>
          <MenuItem key="5" value="5">5</MenuItem>
        </TextField>
      </div>
      <Button variant="contained" type='submit' disabled={props.state ? true : false} endIcon={<SendIcon />}>{props.state ? 'Guardado!' : 'Guardar'}</Button>
    </form>
  )
}

export default SaveEvaluation;