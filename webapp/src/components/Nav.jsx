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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Select, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';

import '../css/nav.css';
import { FormattedMessage } from 'react-intl';
import { useContext } from 'react';
import { SessionContext } from '../SessionContext';
import defaultProfileImg from '../assets/defaultImgProfile.jpg';
import iconImg from '../assets/icon.png';

const gatewayUrl = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";


function Nav({ goTo, changeLanguage, locale, isInGame, changeDaltonicMode }) {

  const [langEnd, setLangEnd] = useState(locale);

  useEffect(() => {
    changeLanguage(langEnd);
  }, [locale, changeLanguage, langEnd]);

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

  const [checked, setChecked] = useState(false);

  const handleCheckBoxChange = (event) => {
    changeDaltonicMode();
    setChecked(event.target.checked);
  };

  return (
    <AppBar className='nav appearEffect' position="static" sx={{ zIndex:'999' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <a className='icono' href="https://github.com/Arquisoft/wiq_es3b" target="_blank" rel="noreferrer">
            <img src={iconImg} alt='icon'/>
          </a>

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
                <Typography textAlign="center"><FormattedMessage id="btm" /></Typography>
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
              <FormControl className={isInGame? 'language disable':'language' } fullWidth margin="normal" 
                sx={{ display:'block', marginTop:'0.2em', zIndex:'9999' }}>
                <Select labelId="language-label" id="language-select" value={langEnd}
                    onChange={(e) => {setLangEnd(e.target.value)}}>
                  <MenuItem value="en"><FormattedMessage id="langen" /></MenuItem>
                  <MenuItem value="es"><FormattedMessage id="langes" /></MenuItem>

                </Select>
              </FormControl>
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
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
              overflow: 'visible'
            }}
            className='tituloNav'
          >
            ASW WIQ
          </Typography>
            <Typography sx={{ my: 2, color: 'white', display: 'block' }}>|</Typography>
            <Typography component="a"
                onClick={() => goToMenuClic()} className='optionsNav'
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <FormattedMessage id="menu" />
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
              <FormControl className={isInGame? 'language disable':'language' } fullWidth margin="normal" sx={{ display:'block', marginTop:'0.2em' }}>
                <Select labelId="language-label" id="language-select" value={langEnd}
                    onChange={(e) => {setLangEnd(e.target.value)}}>
                  <MenuItem value="en"><FormattedMessage id="langen" /></MenuItem>
                  <MenuItem value="es"><FormattedMessage id="langes" /></MenuItem>
                  <MenuItem value="it"><FormattedMessage id="langit" /></MenuItem>
                  <MenuItem value="fr"><FormattedMessage id="langfr" /></MenuItem>

                </Select>
              </FormControl>
          </Box>

          <Box sx={{ flexGrow: 0, flexDirection: 'row', display:'flex', alignItems: 'center', fontWeight: 'bold', zIndex:'9999'}}>
            <Typography component="a" sx={{ marginRight: 2, fontFamily: 'Roboto Slab', color:'#FFF', marginLeft:'1em'}} >{username}</Typography>
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

              <FormControlLabel sx={{ marginLeft:'0.2em' }}
                control={<Checkbox checked={checked} onChange={handleCheckBoxChange} />}
                label={<FormattedMessage id="daltonic" />}
              />
              <MenuItem className='menu' onClick={logoutClic}>
                <Typography textAlign="center"><FormattedMessage id="logout" /></Typography>
              </MenuItem>

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Nav;