import React from 'react';
import { Helmet } from 'react-helmet';
import firebase from 'firebase/app';
import { ref, set, getDatabase, push, onValue } from 'firebase/database';

// IMAGE
import LogoIMG from '../Images/logov1.png';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import app from '../firebase';
import RoulleteDancers from '../Components/Roullete/Roullete';
import { Link } from 'react-router-dom';

const db = getDatabase(app);
const dancersDB = ref(db, 'dancers');
// const scoresDB = ref(db, 'scores');

class FestivalPage extends React.Component {

    state = {
        dancers: null,
        lotteryDancer: null,
        mustSpin: false
    }

    componentDidMount() {
        this.getDancersDB();
    }

    saveDancerDB = async (event) => {
        event.preventDefault();
        const names = event.target.names.value;
        const name_art = event.target.name_art.value;
        const id_image = event.target.id_image.value;

        const datos = {
            nombres: names,
            nombre_artistico: name_art,
            image: `https://drive.google.com/uc?id=${id_image}`,
        };

        console.log("Hola", datos);

        // Utiliza la función "push" para guardar los datos en una nueva referencia
        push(dancersDB, datos)
            .then(() => {
                console.log('Datos guardados en la base de datos');
            })
            .catch((error) => {
                console.error('Error al guardar datos:', error);
            });
    }

    getDancersDB = async () => {
        // Utiliza la función "onValue" para recibir los datos actuales y futuros en la referencia
        onValue(dancersDB, (snapshot) => {
            const datos = snapshot.val();
            let arrayDancers = {
                ...datos
            }
            console.log('Datos actuales:', arrayDancers);
            this.setState({ dancers: arrayDancers });
            console.log("Dancers", arrayDancers);
        });
    }

    randomDancer = async () => {
        this.setState({ mustSpin: true })

        /*const generateDancerRandom = setInterval(() => {
            const dancersLength = Object.keys(this.state.dancers).length;
            let random = Math.floor(Math.random() * dancersLength);
            let randomDancer = Object.keys(this.state.dancers)[random];
            this.setState({ lotteryDancer: randomDancer });
            console.log("Bailarín aleatorio", randomDancer);
        }, 100);

        setTimeout(() => {
            clearInterval(generateDancerRandom);
        }, 5000);*/
    }

    render() {
        let dancers = this.state.dancers !== null ? (
            Object.keys(this.state.dancers).reverse().map(item => {
                return (
                    <Link to={`/festival-calification/${item}`}>
                        <div class="festival__dancers__dancer">
                            {/* {key + 1} */}
                            <div className='festival__dancers__dancer__image' style={{ backgroundImage: `url(${this.state.dancers[item].image})` }}>
                                {/* <img alt={this.state.dancers[item].nombre_artistico} src={this.state.dancers[item].image} /> */}
                            </div>
                            <div className='festival__dancers__dancer__name'>
                                {this.state.dancers[item].nombre_artistico}
                            </div>
                            <div className='festival__dancers__dancer__subname'>
                                {this.state.dancers[item].nombres}
                            </div>
                        </div>
                    </Link>
                )
            })
        ) : (
            <div>Cargando bailarínes...</div>
        )

        let lottery = (this.state.lotteryDancer !== null) ? (
            <div className='festival__dancers__dancer'>
                <div className='festival__dancers__dancer__image'>
                    <img alt={this.state.dancers[this.state.lotteryDancer].nombre_artistico} src={this.state.dancers[this.state.lotteryDancer].image} />
                </div>
                <div className='festival__dancers__dancer__name'>
                    {this.state.dancers[this.state.lotteryDancer].nombre_artistico}
                </div>
            </div>
        ) : (
            <div>
                Escoger aleatoriamente uno de los bailarínes que están participando.
            </div>
        )
        return (
            <>
                <Helmet>
                    <title>Freedanzz | Festival</title>
                </Helmet>
                <div className='festival'>
                    <div className='festival__logo'>
                        <img alt="Logo" src={LogoIMG} />
                    </div>
                    {false && (<div className='festival__form'>
                        <Container component="main" maxWidth="xs">
                            <Box
                                sx={{
                                    marginTop: 8,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Typography component="h1" variant="h5">
                                    Agregar bailarín
                                </Typography>
                                <form onSubmit={this.saveDancerDB}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="names"
                                        label="Nombres"
                                        name="names"
                                        autoComplete="names"
                                        autoFocus
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="name_art"
                                        label="Nombre artístico"
                                        type="text"
                                        id="name_art"
                                    />
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        name="id_image"
                                        label="Id de imágen"
                                        type="text"
                                        id="id_image"
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        color='secondary'
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Guardar
                                    </Button>
                                </form>
                            </Box>
                        </Container>
                    </div>)}
                    {/* TEMAS: theme_comprension */}
                    <div className='festival__dancers theme_comprension'>
                        {dancers}
                    </div>
                    {false && (<div className='festival__lottery'>
                        <RoulleteDancers spin={this.state.mustSpin} />
                        {lottery}
                        <Button
                            type="button"
                            fullWidth
                            color='secondary'
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.randomDancer}
                        >
                            Sortear bailarín
                        </Button>
                    </div>)}
                </div>
            </>
        )
    }

}

export default FestivalPage;