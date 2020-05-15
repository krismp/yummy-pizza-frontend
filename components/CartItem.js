import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
// import RemoveIcon from '@material-ui/icons/Remove';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetCart, showAlert } from '../store';

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  input: {
    width: 100,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

function CartItem(props) {
  const classes = useStyles();

  async function deleteItem () {
    props.onDeleteItem(props.itemId, props.total);
  }

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image="https://material-ui.com/static/images/cards/paella.jpg"  
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h5" variant="h5">
            {props.product.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            ${props.total_price_in_usd}
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          {/* disabled, nice to have feature */}
          {/* <IconButton aria-label="previous">
            <AddIcon/>
          </IconButton> */}
          <IconButton aria-label="play/pause">
            <TextField
              id="outlined-read-only-input"
              label="Total"
              defaultValue={props.total}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              className={classes.input}
            />
          </IconButton>
          {/* disabled, nice to have feature */}
          {/* <IconButton aria-label="next" disabled>
            <RemoveIcon/>
          </IconButton> */}
          <IconButton aria-label="next" onClick={deleteItem}>
            <DeleteIcon/>
          </IconButton>
        </div>
      </div>
    </Card>
  );
}

function mapStateToProps(state) {
  const { cartId } = state
  return { cartId }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ resetCart, showAlert }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);