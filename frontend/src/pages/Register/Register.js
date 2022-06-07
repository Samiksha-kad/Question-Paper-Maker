import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { registerService } from "../../config/UserService";
import styles from "./Register.module.css";
import BorderColorTwoToneIcon from "@mui/icons-material/BorderColorTwoTone";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import NavvBar from '../Navvbar/Navvbar'
import { TextField, FormControl, Button, InputAdornment, Container, IconButton, Alert } from "@mui/material";
const mystyles = {
    '& .MuiFormHelperText-root': {
        color: "red",
    }
}
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export default function Registration() {
    const [errors, setErrors] = useState({
        errFirstname: "",
        errLastname: "",
        errEmail: "",
        errPassword: "",
        errConfirm_password: "",
        submit_error: "",
    });
    const [registerCredentials, setRegisterCredentials] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        cpassword: "",
        profile: "",
    });
    const [show, setShow] = useState({
        showPassword: false,
        showConfPassword: false,
    });

    const navigate = useNavigate();

    // For Validation
    const handler = (event) => {
        const { name, value } = event.target;
        let error = "";
        switch (name) {
            case "firstname":
                error = regForName.test(value) ? "" : "Invalid First  Name";
                setErrors({ ...errors, errFirstname: error });
                break;

            case "lastname":
                error = regForName.test(value) ? "" : "Invalid Last  Name";
                setErrors({ ...errors, errLastname: error });
                break;

            case "email":
                error = regForEmail.test(value) ? "" : "Invalid Email";
                setErrors({ ...errors, errEmail: error });
                break;

            case "password":
                error = regForpassword.test(value) ? "" : "Enter Strong Password";
                setErrors({ ...errors, errPassword: error });
                break;

            case "cpassword":
                error = value === registerCredentials.password ? "" : "Password does not match";
                setErrors({ ...errors, errConfirm_password: error });
                break;
            default:
                break;
        }
        setRegisterCredentials({ ...registerCredentials, [name]: value });
    };

    // New User Registration
    const validateRegister = async () => {
        if (registerCredentials.firstname !== "" && registerCredentials.lastname !== "" && registerCredentials.email !== "" && registerCredentials.password !== "" && registerCredentials.confirm_password !== "" && registerCredentials.profile !== ""
        ) {
            const formData = new FormData();
            formData.append("firstname", registerCredentials.firstname);
            formData.append("lastname", registerCredentials.lastname);
            formData.append("email", registerCredentials.email);
            formData.append("profile", registerCredentials.profile);
            formData.append("password", registerCredentials.password);

            await registerService(formData)
                .then(res => {
                    alert(res.data.message)
                    navigate("/login")
                })
                .catch(err => {
                    alert(err.response.data)

                })
        }

        else {
            setErrors({ ...errors, submit_error: "Enter All Registration Details" });
        }
    };

    return (
        <>
            <NavvBar />
            <Container>
                <div className={styles.registration}>
                    <h3 className="text-center">REGISTER HERE</h3>
                    {errors.submit_error.length !== 0 && (
                        <Alert severity="error">{errors.submit_error}</Alert>
                    )}
                    <FormControl sx={{ my: 2 }} fullWidth>
                        <TextField
                            helperText={errors.errFirstname}
                            sx={mystyles}
                            name="firstname"
                            label="Firstname"
                            size="small"
                            onBlur={handler}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <BorderColorTwoToneIcon color="info" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            color="info"
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            helperText={errors.errLastname}
                            sx={mystyles}
                            name="lastname"
                            label="Lastname"
                            size="small"
                            onBlur={handler}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <BorderColorTwoToneIcon color="info" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            color="info"
                        />
                    </FormControl>

                    <FormControl sx={{ my: 2 }} fullWidth>
                        <TextField
                            helperText={errors.errEmail}
                            sx={mystyles}
                            name="email"
                            label="Email"
                            size="small"
                            onBlur={handler}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment >
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
                            helperText={errors.errPassword}
                            sx={mystyles}
                            name="password"
                            label="Password"
                            size="small"
                            type={show.showPassword ? "text" : "password"}
                            onBlur={handler}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <IconButton
                                            color="info"
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setShow({ ...show, showPassword: !show.showPassword })
                                            }
                                            edge="end"
                                        >
                                            {show.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            color="info"
                        />
                    </FormControl>

                    <FormControl sx={{ my: 2 }} fullWidth>
                        <TextField
                            helperText={errors.errConfirm_password}
                            sx={mystyles}

                            name="cpassword"
                            label="Confirm Password"
                            size="small"
                            type={show.showConfPassword ? "text" : "password"}
                            onBlur={handler}

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment>
                                        <IconButton
                                            color="info"
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setShow({
                                                    ...show,
                                                    showConfPassword: !show.showConfPassword,
                                                })
                                            }
                                            edge="end"
                                        >
                                            {show.showConfPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            color="info"
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <TextField
                            type="file"
                            label="Profile"
                            name="profile"
                            focused
                            onChange={(e) =>
                                setRegisterCredentials({
                                    ...registerCredentials,
                                    profile: e.target.files[0],
                                })
                            }
                            variant="outlined"
                        />
                    </FormControl>

                    <div className="text-center">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => validateRegister()}
                            className={styles.button_fun}
                        >
                            Register
                        </Button>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>
                            Already have an account?
                        </span>
                        <Link
                            to="/login"
                            className="font-weight-bold"
                            style={{ textDecoration: "none" }}
                        >
                            {" "}
                            Login here
                        </Link>

                    </div>
                </div>
            </Container>
        </>
    );
}