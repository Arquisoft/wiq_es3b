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

import { useContext } from 'react';
import { SessionContext } from '../SessionContext';
import defaultProfileImg from '../assets/defaultImgProfile.jpg';
import iconImg from '../assets/icon.png';

function Nav({ goTo }) {

  const { sessionData } = useContext(SessionContext);
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

  const logoutClic = () => {
    goTo(0);
    handleCloseUserMenu();
  }

  return (
    <AppBar className='nav' position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
        <img className="icono" src={iconImg} />
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
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            ASW WIQ
          </Typography>

          <Typography sx={{ marginRight:'1em' }}>|</Typography>

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
                <Typography textAlign="center">Volver al menú</Typography>
              </MenuItem>
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                onClick={() => goToMenuClic()}
                sx={{ my: 2, color: 'white', display: 'block' }} className='navButton'
              >
                Menu
              </Button>
          </Box>

          <Box sx={{ flexGrow: 0, flexDirection: 'row', display:'flex', alignItems: 'center', fontWeight: 'bold'}}>
            <Typography sx={{ marginRight: 2, fontFamily: 'Roboto Slab'}} >{username}</Typography>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
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