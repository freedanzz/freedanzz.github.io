import React from 'react';

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert } from '@mui/material';



const UserLogin = (props) => {
    console.log(props.messageForm)
    return (
        <div className='wrapLogin'>
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
                        Ingresar
                    </Typography>
                    <form onSubmit={props.login}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Usuario"
                            name="username"
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="secondary" />}
                            label="Recordarme"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            color='secondary'
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Entrar
                        </Button>
                        <Alert severity={props.stateLogin === 1 ? 'success' : 'error'} style={{display: props.messageForm == null || props.messageForm == '' ? 'none' : 'flex'}}>
                            {props.messageForm}
                        </Alert>
                    </form>
                </Box>
            </Container>
        </div>
    )
}

export default UserLogin;