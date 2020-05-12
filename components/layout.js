import React from 'react';
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';

import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalPizzaIcon from '@material-ui/icons/LocalPizza';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  body: {
    marginTop: `5rem`,
    margin: `3rem auto`,
    maxWidth: `900px`,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    fontFamily: theme.typography.fontFamily,
    textDecoration: `none`,
    color: theme.palette.primary.contrastText,
    marginRight: `20px`
  }
}));

export default function Layout({ children }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <LocalPizzaIcon />
          </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link href="/">
                <a className={classes.link}>Yummy Pizza</a>
              </Link>
            </Typography>
            <Link href="/orders">
              <a className={classes.link}>Your Orders</a>
            </Link>
            <Link href="/login">
              <a className={classes.link}>Login</a>
            </Link>
            <Link href="/cart">
              <a className={classes.link}>
                <Badge badgeContent={0} color="secondary">
                  <ShoppingCartIcon/>
                </Badge>
              </a>
            </Link>
        </Toolbar>
      </AppBar>
      <Box className={classes.body}>
        {children}
      </Box>
    </Box>
  );
}
