import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Link from "next/link";
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resetCart, showAlert } from '../store';
import Chip from '@material-ui/core/Chip';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import theme from "../src/theme";

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

const Price = withStyles({
  root: {
    fontSize: `18px`,
    marginBottom: theme.spacing(2)
  }
})(Chip);

function CartItem(props) {
  const classes = useStyles();

  async function deleteItem () {
    props.onDeleteItem(props.itemId, props.total);
  }

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.cover}
        image={props.product.image}
        title="Live from space album cover"
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Link
            href={`/products/[id]`}
            as={`/products/${props.product.id}`}
          >
            <a>
              <Typography component="h5" variant="h5">
                {props.product.name}
              </Typography>
            </a>
          </Link>
          <Price
            label={props.total_price_in_usd}
            color="primary"
            variant="outlined"
            size="medium"
            icon={<AttachMoneyIcon />}
          />
        </CardContent>
        <div className={classes.controls}>
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