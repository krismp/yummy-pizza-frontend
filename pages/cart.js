import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import CircularProgress from '@material-ui/core/CircularProgress';
import CartItem from "../components/CartItem";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { removeFromCart, showAlert } from '../store';
import { useRouter } from "next/router";

const TotalCartPrice = withStyles({
  root: {
    zIndex: 1,
    right: 0,
    position: `fixed`,
    backgroundColor: `white`,
    padding: `1rem`,
    bottom: `0`,
  },
})(Paper);

const { publicRuntimeConfig } = getConfig();

export function CartPage(props) {
  const [cart, setCart] = useState({ cart_items: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (props.cartId) {
      setLoading(true);
      const result = await fetch(
        `${publicRuntimeConfig.API_BASE_URL}/carts/${props.cartId}`,
      );
  
      const json = await result.json();
      setCart(json.data);
      setLoading(false);
    }
  }

  const handleCheckout = () => {
    router.push("/checkout");
  }

  const handleDeleteCartItem = async(itemId, total) => {
    setLoading(true);
    const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/cart_items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await res.json();
    setLoading(false);
    if (data.success) {
      props.showAlert({
        message: data.message,
        severity: "success"
      });
      props.removeFromCart(parseInt(total));
      fetchData();
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

  return <>
    <Typography gutterBottom variant="h5" component="h2">
      Your Cart
    </Typography>
    <Grid
      container
      direction="row"
      justify="flex-end"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12}>
        {!loading && cart.cart_items.length > 0 ?
          cart.cart_items.map((item) => {
            return (
              <CartItem
                key={item.id}
                itemId={item.id}
                total={item.total}
                total_price_in_usd={item.total_price_in_usd}
                product={item.product}
                onDeleteItem={handleDeleteCartItem}
              />
            );
          }) : (loading ? <CircularProgress/> : <Typography gutterBottom variant="body2" component="p">
            Your cart is empty!
          </Typography>)
        }
      </Grid>
    </Grid>
    {cart.cart_items.length > 0 && <TotalCartPrice elevation={6}>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={6}>
          <Typography gutterBottom variant="h5" component="h2">
            Total: ${cart.total_price}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={handleCheckout}>
            {props.isLoggedIn ? `Checkout` : `Checkout as Guest` }
          </Button>
        </Grid>
      </Grid>
    </TotalCartPrice>}
  </>;
}

function mapStateToProps(state) {
  const { cartId, isLoggedIn } = state;
  return { cartId, isLoggedIn };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ removeFromCart, showAlert }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
