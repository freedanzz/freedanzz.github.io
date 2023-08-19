import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import app from '../firebase';

const FestivalClassified = () => {

    const db = getDatabase(app);
    const scoresDB = ref(db, 'scores');
    const dancersDB = ref(db, 'dancers');

    const [dancersClassified, setDancersClassified] = useState(null);

    const getScoresDancers = async () => {
        let arrayScores = [];
        await onValue(scoresDB, (snapshot) => {
            const datos = snapshot.val();
            console.log("jajaja", datos);
            for (const elemnt of Object.keys(datos)) {
                const existDancer = arrayScores.findIndex(item => item.id_calificado === datos[elemnt].id_calificado);
                if (existDancer !== -1) {
                    arrayScores[existDancer].tecnica += datos[elemnt].tecnica;
                    arrayScores[existDancer].expresion += datos[elemnt].expresion;
                    arrayScores[existDancer].musicalidad += datos[elemnt].musicalidad;
                    arrayScores[existDancer].dominio_espacial += datos[elemnt].dominio_espacial;
                } else {
                    arrayScores.push({
                        id_calificado: datos[elemnt].id_calificado,
                        id_jurado: datos[elemnt].id_jurado,
                        tecnica: datos[elemnt].tecnica,
                        expresion: datos[elemnt].expresion,
                        musicalidad: datos[elemnt].musicalidad,
                        dominio_espacial: datos[elemnt].dominio_espacial,
                        observaciones: datos[elemnt].observaciones
                    })
                }
            };

            // ASSIGN NAME DANCERS
            for (let i = 0; i < arrayScores.length; i++) {
                onValue(ref(db, `dancers/${arrayScores[i].id_calificado}`), (snapshot) => {
                    const datos = snapshot.val();
                    arrayScores[i].nombre_artistico = datos.nombre_artistico;
                    arrayScores[i].image = datos.image;
                    arrayScores[i].score = Number((parseFloat(arrayScores[i].tecnica) + parseFloat(arrayScores[i].expresion) + parseFloat(arrayScores[i].musicalidad) + parseFloat(arrayScores[i].dominio_espacial)).toFixed(2));
                });
            }
            console.log("Dataaaaaa", arrayScores);
            setDancersClassified(arrayScores);
        })

    }

    useEffect(() => {
        getScoresDancers();
    }, []);

    let dancers = dancersClassified !== null ? (
        dancersClassified.sort((a, b) => a.score > b.score ? -1 : 1).slice(0, 6).map(item => {
            return (
                <div className='festival__classified__dancers__dancer'>
                    <div className='dancer--image' style={{ backgroundImage: `url(${item.image})` }}></div>
                    <div className='dancer--name'>{item.nombre_artistico}</div>
                    <div className='dancer--score'>
                        Puntaje final: <b>{item.score}/60</b>
                    </div>
                </div>
            )
        })
    ) : (
        <div>Cargando...</div>
    )

    return (
        <div className='festival__classified'>
            <h1>CLASIFICADOS A SEGUNDA FASE</h1>
            <div className='festival__classified__dancers'>
                {dancers}
            </div>
        </div>
    )
};

export default FestivalClassified;