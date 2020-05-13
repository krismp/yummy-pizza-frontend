import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Layout from "../components/layout";
import Item from '../components/item';

const useStyles = makeStyles( theme => ({
  root: {
    zIndex: 1,
    right: 0,
    position: `fixed`,
    backgroundColor: `white`,
    padding: `1rem`,
    bottom: `0`,
  }
}));

export default function ImgMediaCard() {
  const classes = useStyles();

  return (
    <Layout>
      <Typography gutterBottom variant="h5" component="h2">
        Your Order
      </Typography>
      <Grid container direction="row" justify="flex-end" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>

        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
        <Grid item xs={12}>
          <Item/>
        </Grid>
      </Grid>
      <Paper className={classes.root} elevation={6}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom variant="h5" component="h2">
              Total: $100
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary">
              Checkout
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Layout>
  );
}
