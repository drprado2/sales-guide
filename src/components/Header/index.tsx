import React, { useRef } from 'react';
import './styles.scss';
import { Avatar } from 'primereact/avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Badge } from 'primereact/badge';
import { fade, InputBase, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
// @ts-ignore
import Burger from 'react-css-burger';
import { Link, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';
import { allRoutes, signOutRequest } from '../../store/modules/auth/slice';
import { StoreState } from '../../store';
import { toggleDrawer } from '../../store/modules/template/slice';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  inputRoot: {
    color: 'white',
    borderRadius: '20px',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    border: '2px solid var(--surface-200)',
    borderRadius: '20px',
    height: '1.4em',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { drawerOpen } = useSelector((state: StoreState) => state.template);
  const { avatarImage, name, id } = useSelector((state: StoreState) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const { logout } = useAuth0();

  const op = useRef(null);
  const notificationRef = useRef(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const userProfileRoute = allRoutes.find((r) => r.id === 'view-user-profile');

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div id="header">
      <Burger
        style={{ margin: 0 }}
        onClick={() => dispatch(toggleDrawer())}
        active={drawerOpen}
        burger="arrowalt"
        color="pink"
        hoverOpacity={0.8}
        scale={1}
      />
      <div style={{ flexGrow: 1 }} />
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Pesquisar"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
      <div ref={notificationRef} className="notifications-area">
        <Button
          icon="pi pi-bell"
          className="p-button-rounded p-overlay-badge"
          style={{ color: 'white' }}
          onClick={(e) => {
            // @ts-ignore
            op.current.toggle(e);
          }}
        />
        <Badge value="2" />
      </div>
      <OverlayPanel ref={op} showCloseIcon dismissable>
        Notificações aqui
      </OverlayPanel>
      <Button className="p-button-text avatar-area" onClick={handleClick}>
        <Avatar image={avatarImage} className="p-mr-2" size="large" shape="circle" />
        <span className="name">{name}</span>
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
          handleClose();
          history.push(generatePath(userProfileRoute?.path ?? '', { id }));
        }}
        >
          Perfil
        </MenuItem>
        <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Sair</MenuItem>
      </Menu>
    </div>
  );
};

export default Header;
