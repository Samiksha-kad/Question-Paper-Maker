import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router";
import jwtdecode from 'jwt-decode';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';


function Navvbar() {
    const [profile, setprofile] = useState('')
    const [isLogin, setIsLogin] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('_token') !== null) {
            const token = localStorage.getItem('_token');
            const decode = jwtdecode(token)
            setIsLogin(true)
            console.log(decode)
            setprofile(decode.profile)
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('_token');
        localStorage.removeItem('question');
        setIsLogin(false)
        navigate("/")
    }
    const [navDropDownData, setNavDropDownData] = useState(null);
    const [userDropDown, setUserDropDown] = useState(null);

    return (
        <>

            <AppBar position="static" sx={{ bgcolor: "#111111" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h5"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                            onClick={() => navigate("/")}>
                            Question<span style={{ color: "red" }}>Paper</span>
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={(e) => setNavDropDownData(e.currentTarget)}
                                color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu id="menu-appbar" anchorEl={navDropDownData}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(navDropDownData)}
                                onClose={() => setNavDropDownData(null)}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}>

                                <MenuItem onClick={() => navigate('/')} >
                                    <Typography textAlign="center">Home</Typography>
                                </MenuItem>

                                {isLogin &&
                                    <MenuItem onClick={() => navigate('/create')}>
                                        <Typography textAlign="center">Create</Typography>
                                    </MenuItem>
                                }
                            </Menu>
                        </Box>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} onClick={() => navigate("/")}>
                            Question<span style={{ color: "red" }}>Paper</span>
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Button onClick={() => navigate('/')} sx={{ my: 2, color: 'white', display: 'block' }}> Home</Button>
                            {isLogin &&
                                <Button onClick={() => navigate('/create')} sx={{ my: 2, color: 'white', display: 'block' }}> Create</Button>
                            }
                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            {isLogin ?
                                <>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={(e) => setUserDropDown(e.currentTarget)} sx={{ p: 0 }}>
                                            <Avatar alt="User" src={`../images/${profile}`} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={userDropDown}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(userDropDown)}
                                        onClose={() => setUserDropDown(null)}>
                                        <MenuItem onClick={() => logout()}>
                                            <Typography textAlign="center">Logout</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                                :
                                <>
                                    <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Login</Button>
                                    &nbsp;&nbsp;
                                    <Button variant="contained" color="warning" onClick={() => navigate('/registration')}>SignUp</Button>

                                </>
                            }
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}

export default Navvbar;
