import { Button, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import BackHand from '@mui/icons-material/ArrowBack';
import app from '../firebase';
import { child, get, getDatabase, push, ref, update } from 'firebase/database';
import { Link, useParams } from 'react-router-dom';

const FestivalCalification = () => {
    const { id } = useParams();
    const [dancer, setDancer] = useState({ image: null });
    const [jury, setJury] = useState(null);
    const [stateCalification, setStateCalification] = useState(false);
    const getDataDancer = () => {
        const dbRef = ref(getDatabase());
        get(child(dbRef, `dancers/${id}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                setDancer(snapshot.val());
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        console.log("Jurado", jury);
    };

    const saveCalification = (event) => {
        event.preventDefault();
        console.log(event);
        const data = {
            id_calificado: id,
            id_jurado: event.target.jur.value,
            tecnica: parseFloat(event.target.tec.value),
            expresion: parseFloat(event.target.exp.value),
            musicalidad: parseFloat(event.target.mus.value),
            dominio_espacial: parseFloat(event.target.des.value),
            observaciones: event.target.obs.value
        }

        const db = getDatabase(app);
        const dancersDB = ref(db, 'scores');

        push(dancersDB, data)
            .then(() => {
                console.log('Datos guardados en la base de datos');
                setStateCalification(true);
            })
            .catch((error) => {
                console.error('Error al guardar datos:', error);
            });

        const userRef = child(ref(db, 'dancers'), id);
        update(userRef, { calificado: true });

    };

    useState(() => {
        getDataDancer();
    }, []);

    return (
        <>
            <form className='festival__calification' onSubmit={saveCalification}>
                <Button className='festival__calification__back' type='button' startIcon={<BackHand />}><Link to={'/festival'}>Volver</Link></Button>
                <h2 className='festival__calification__title'>Calificación</h2>

                <div className='festival__calification__dancer'>
                    <div className='festival__calification__dancer__image' style={{ backgroundImage: `url(${dancer.image})` }}>

                    </div>
                    <div className='festival__calification__dancer__name'>
                        {dancer.nombre_artistico}
                    </div>
                    {/* <TextField
                    id="id_dancer"
                    select
                    label="Bailarín"
                    name='id_dancer'
                    className='Inputs'
                >
                    <MenuItem key={1} value={'jddjdjd'}>
                        Juan Perez
                    </MenuItem>
                </TextField> */}
                </div>
                <div className='festival__calification__jury'>
                    {!stateCalification && (<><TextField
                        id="jur"
                        name='jur'
                        select
                        label="Jurado"
                        className='Select'
                    >
                        <MenuItem value="" disabled>
                            <em>Seleccione...</em>
                        </MenuItem>
                        <MenuItem key="Adams S." value="Adams S.">Adams Smith</MenuItem>
                        <MenuItem key="Carlos D." value="Carlos D.">Carlos Diaz</MenuItem>
                        <MenuItem key="Andres O." value="Andres O.">Andrés Orozco</MenuItem>
                    </TextField>
                        <TextField
                            id="tec"
                            name="tec"
                            className='Inputs'
                            label="Técnica"
                            type="number"
                            inputProps={{ step: '0.1', max: 5 }} // Admite decimales
                        />
                        <TextField
                            id="exp"
                            name="exp"
                            className='Inputs'
                            label="Expresión"
                            type="number"
                            inputProps={{ step: '0.1', max: 5 }} // Admite decimales
                        />
                        <TextField
                            id="mus"
                            name="mus"
                            className='Inputs'
                            label="Musicalidad"
                            type="number"
                            inputProps={{ step: '0.1', max: 5 }} // Admite decimales
                        />
                        <TextField
                            id="des"
                            name="des"
                            className='Inputs'
                            label="Dominio espacial"
                            type="number"
                            inputProps={{ step: '0.1', max: 5 }} // Admite decimales
                        />
                        <TextField
                            id="obs"
                            name="obs"
                            className='Textarea'
                            label="Observaciones"
                            multiline
                            rows={6}
                        /></>)}
                    {stateCalification && (
                        <div>
                            Usuario guardado correctamente.
                        </div>
                    )}
                </div>
                {!stateCalification && <Button variant="contained" type='submit'>Guardar</Button>}
                {/* <div style={{ marginTop: 40 }}>
                <h3>Notificar a bailarines</h3>
                <p>
                    Al hacer click en el botón <b>"Notificar calificaciones"</b>, se enviarán a todos los usuarios registrados
                    que aceptaron recibir notificaciones un mensaje de que ya sus calificaciones han sido cargadas.
                </p>
                <Button variant='contained' type='button' endIcon={<SendIcon />}>Notificar calificaciones</Button>
            </div> */}
            </form>
        </>
    )
}

export default FestivalCalification;