import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Layout from "../components/layout";
import CartItem from "../components/CartItem";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { removeFromCart, showAlert } from '../store';

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
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (props.cartId) {
      const result = await fetch(
        `${publicRuntimeConfig.API_BASE_URL}/carts/${props.cartId}`,
      );
  
      const json = await result.json();
      setCart(json.data);
    }
  }

  async function handleDeleteCartItem(itemId, total) {
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

  if (cart.cart_items.length > 0) {
    return <Layout>
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
          {cart.cart_items.length > 0 &&
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
            })}
        </Grid>
      </Grid>
      <TotalCartPrice elevation={6}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={6}>
            <Typography gutterBottom variant="h5" component="h2">
              Total: ${cart.total_price}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary">
              Checkout
            </Button>
          </Grid>
        </Grid>
      </TotalCartPrice>
    </Layout>;
  }
  return (
    <Layout>
      <Typography gutterBottom variant="h5" component="h2">
        Your cart is empty!
      </Typography>
    </Layout>
  )
}

function mapStateToProps(state) {
  const { cartId } = state;
  return { cartId };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ removeFromCart, showAlert }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CartPage);
