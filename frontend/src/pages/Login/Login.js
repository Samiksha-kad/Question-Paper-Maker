import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { loginService } from "../../config/UserService";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Navvbar from '../Navvbar/Navvbar';

import {
    TextField, FormControl, Button, InputAdornment, Container, Alert, IconButton
} from "@mui/material";
import styles from "./Login.module.css";
export default function Login() {
    const [loginCredentials, setLoginCredentials] = useState({
        email: "",
        password: "",
        showPassword: false,
        error: "",
    });
    const navigate = useNavigate();

    // Check email and password at login time
    const validateLogin = () => {

        if (loginCredentials.email !== "" && loginCredentials.password !== "") {
            loginService({ email: loginCredentials.email, password: loginCredentials.password })
                .then(res => {
                    console.log(res)
                    localStorage.setItem("_token", res.data.user);
                    navigate("/")
                })
                .catch(err => {
                    setLoginCredentials({ ...loginCredentials, error: err.response.data.message });
                })
        }
        else {
            setLoginCredentials({ ...loginCredentials, error: "please enter login details" });
        }
    };

    return (
        <>
            <Navvbar />
            <Container>
                <div className={styles.loginCss}>
                    <h3 className="text-center pb-3">Login Here</h3>
                    {loginCredentials.error.length !== 0 && (
                        <Alert severity="error">{loginCredentials.error}</Alert>
                    )}
                    <FormControl sx={{ my: 2 }} fullWidth>
                        <TextField
                            name="email"
                            label="Email"
                            size="small"
                            type="text"
                            onChange={(e) => setLoginCredentials({ ...loginCredentials, email: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <EmailIcon color="info" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            color="info"
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            name="password"
                            label="Password"
                            size="small"
                            type={loginCredentials.showPassword ? "text" : "password"}
                            onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            color="info"
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setLoginCredentials({
                                                    ...loginCredentials,
                                                    showPassword: !loginCredentials.showPassword,
                                                })
                                            }
                                            edge="end"
                                        >
                                            {loginCredentials.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            color="info"
                        />
                    </FormControl>

                    <div className="text-center">
                        <Button
                            onClick={() => validateLogin()}
                            variant="contained"
                            color="success"
                            className="px-5"
                        >
                            Login
                        </Button>
                    </div>

                    <div className="d-flex justify-content-between">
                        Don't have an account?{" "}
                        <Link to="/registration" className="fw-bold text-body">
                            Register here
                        </Link>
                    </div>
                </div>
            </Container>
        </>
    );
}