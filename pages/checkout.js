import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link,
  Box,
  Typography,
  CircularProgress,
  Container
} from "@material-ui/core";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { showAlert, resetCart } from '../store';
import { useRouter } from "next/router";
import { getCart, postCreateOrder } from "../lib/api";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Yummy Pizza
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const randomDeliveryCost = () => {
  const float = Math.random() * (10 - 5) + 5;

  return parseFloat(float.toFixed(2));
}

function Checkout(props) {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ cart_items: [] });
  const [address, setAddress] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(randomDeliveryCost);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    if (props.cartId) {
      setLoading(true);
      const json = await getCart(props.cartId);
      setCart(json.data);
      setLoading(false);
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    const { user, cartId } = props;
    setLoading(true);
    const data = await postCreateOrder({
      userId: user ? user.id : user,
      cartId,
      address,
      deliveryCost,
      finalPrice: parseFloat((cart.total_price + deliveryCost).toFixed(2)),
    });
    setLoading(false);
    if (data.success) {
      props.resetCart(data.data);
      props.showAlert({
        message: data.message,
        severity: "success"
      });
      if (props.isLoggedIn) {
        router.push("/orders");
      } else {
        router.push("/");
      }
    } else {
      const mainMessage = data.message;
      const message = Object.keys(data.data).map(err => {
        return <>
          {data.data[err].map(e => {
            return <li>{e}</li>
          })}
        </>
      });
      props.showAlert({
        message: (<>
          <p>{mainMessage}</p>
          <ul>{message}</ul>
        </>),
        severity: "error"
      });
    }
  }

  const finalPrice = parseFloat((cart.total_price + deliveryCost).toFixed(2));
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <MonetizationOnIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Checkout {!props.isLoggedIn && `as guest`}
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && <TableRow>
              <TableCell align="center" colSpan={3}>
                <CircularProgress/>
              </TableCell>
            </TableRow>}
            {!loading && cart.cart_items.length > 0 && cart.cart_items.map((item) => (
              <TableRow key={item.product.id}>
                <TableCell component="th" scope="row">
                    {item.product.name}
                </TableCell>
                <TableCell align="right">{item.total}</TableCell>
                <TableCell align="right">${item.total_price_in_usd}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableRow>
            <TableCell variant="footer" colSpan={2}>Cost Delivery</TableCell>
            <TableCell variant="footer" align="right">${deliveryCost}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell variant="head" colSpan={2}>TOTAL</TableCell>
            <TableCell variant="head" align="right">${finalPrice}</TableCell>
          </TableRow>
        </Table>
        <form className={classes.form} noValidate onSubmit={handleCheckout}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="address"
            label="Enter your delivery address"
            name="address"
            autoComplete="address"
            multiline
            rows={10}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Complete Order
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

const mapStateToProps = (state) => {
  const { cartId, isLoggedIn, user } = state;
  return { cartId, isLoggedIn, user };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ resetCart, showAlert }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);