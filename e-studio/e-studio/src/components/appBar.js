import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { render } from '@testing-library/react';
import { useHistory } from "react-router-dom";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function Draw() {
  const classes = useStyles();

  const history = useHistory();

  const Home = () =>{ 
    let path = `/`;
    history.push(path);
  }

  const userUpdate = () => {
    let path = `/admin/User_edit`;
    history.push(path);
  }

  const userDelete = () => {
    let path = `/admin/User_deactivate`;
    history.push(path);
  }

  const userReactivated = () => {
    let path = `/admin/User_reactivate`;
    history.push(path);
  }

  const studioUpdate = () => {
    let path = `/admin/Studio_edit`;
    history.push(path);
  }

  const studioDelete = () => {
    let path = `/admin/Studio_delete`;
    history.push(path);
  }

  const Code_promo = () => {
    let path = `/admin/code_promo`;
    history.push(path);
  }

  const Get_Code = () => {
    let path = `/admin/Get_Code`;
    history.push(path);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer} style={{backgroundColor: '#F0F3BD'}}>
          <List>
            
              <ListItem button onClick={Home}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary= 'Home' />
              </ListItem>

              <ListItem button onClick={userUpdate}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary= 'Mettre a jour un compte' />
              </ListItem>
              <ListItem button onClick={userDelete}>
                <ListItemIcon>
                  <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary= 'Désactiver un compte' />
              </ListItem>
              <ListItem button onClick={userReactivated}>
                <ListItemIcon>
                  <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary= 'Réactiver un compte' />
              </ListItem>
              <ListItem button onClick={studioUpdate}>
                <ListItemIcon>
                  <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary= 'Mettre a jour un studio' />
              </ListItem>
              <ListItem button onClick={studioDelete}>
                <ListItemIcon>
                  <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary= 'Supprimer un studio' />
              </ListItem>
              <ListItem button onClick={Code_promo}>
                <ListItemIcon>
                  <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary= 'Crée un code promo' />
              </ListItem>
              <ListItem button onClick={Get_Code}>
                <ListItemIcon>
                  <InboxIcon /> 
                </ListItemIcon>
                <ListItemText primary= 'Afficher les codes promos' />
              </ListItem>
           
          </List>
          <Divider />
         
        </div>
      </Drawer>
      {/* <main className={classes.content}>
        <Toolbar />
      </main> */}
    </div>
  );
}
