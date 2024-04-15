import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import '../css/nav.css';
import { useContext } from 'react';
import { SessionContext } from '../SessionContext';
import defaultProfileImg from '../assets/defaultImgProfile.jpg';
import iconImg from '../assets/icon.png';
const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

function Nav({ goTo }) {

  const { sessionData, clearSessionData } = useContext(SessionContext);
  const username = sessionData ? sessionData.username : 'noUser';
  const profileImgSrc = sessionData && sessionData.profileImage ? 
        require(`../assets/${sessionData.profileImage}`) : defaultProfileImg;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const goToMenuClic = () => {
    goTo(1);
    handleCloseNavMenu();
    handleCloseUserMenu();
  }

  const logoutClic = async() => {
    clearSessionData();
    goTo(0);
    handleCloseUserMenu();
  }

  return (
    <AppBar className='nav' position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <a className='icono' href="https://github.com/Arquisoft/wiq_es3b" target="_blank" rel="noreferrer">
            <img src={iconImg} alt='icon'/>
          </a>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            onClick={() => goToMenuClic()}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color:'#8f95fd',
              textDecoration: 'none',
              marginLeft: '16px',
            }}
            className='tituloNav'
          >
            ASW WIQ
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              
              <MenuItem className='menu' onClick={() => goToMenuClic()}>
                <Typography textAlign="center">Back to menu</Typography>
              </MenuItem>
              <Button
                href={gatewayUrl + '/api-doc'}
                sx={{ margin: '0 !important', padding:'6px 16px', fontWeight: '400', fontSize: '1rem',
                my: 2, color: 'white', display: 'block' }}
              >
                API DOC
              </Button>
              <Button
                href={"https://github.com/Arquisoft/wiq_es3b"}
                sx={{ margin: '0 !important', padding:'6px 16px', fontWeight: '400', fontSize: '1rem',
                my: 2, color: 'white', display: 'block' }}
              >
                Github
              </Button>
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Typography sx={{ my: 2, color: 'white', display: 'block' }}>|</Typography>
            <Typography component="a"
                onClick={() => goToMenuClic()} className='optionsNav'
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Menu
              </Typography>
              <Typography component="a"
                href={gatewayUrl + '/api-doc'} className='optionsNav' target="_blank" rel="noreferrer"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                API-DOC
              </Typography>
              <Typography component="a"
                href={"https://github.com/Arquisoft/wiq_es3b"} className='optionsNav' target="_blank" rel="noreferrer"
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Github Repo
              </Typography>
          </Box>

          <Box sx={{ flexGrow: 0, flexDirection: 'row', display:'flex', alignItems: 'center', fontWeight: 'bold'}}>
            <Typography component="a" sx={{ marginRight: 2, fontFamily: 'Roboto Slab', color:'#FFF'}} >{username}</Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: '2px solid #FFF' }}>
                <Avatar alt="Remy Sharp" src={profileImgSrc}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem className='menu' onClick={logoutClic}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Nav;