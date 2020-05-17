import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToCart, showAlert } from "../../store";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import theme from "../../src/theme";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

const Price = withStyles({
  backgroundColor: theme.palette.primary.main,
  color: `white`,
  padding: theme.spacing(1),
})(Typography);

const { publicRuntimeConfig } = getConfig();

function ProductDetail(props) {
  const [loading, setLoading] = useState(false);
  const { product, cartId, addToCart, showAlert, user } = props;

  async function handleAddToCart() {
    setLoading(true);
    const body = JSON.stringify({
      user_id: user.id,
      cart_id: cartId,
      product_id: product.id,
      total: 1,
      total_price_in_usd: parseFloat(product.price_in_usd),
    });

    const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/cart_items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const data = await res.json();
    setLoading(false);
    if (data.success) {
      showAlert({
        message: data.message,
        severity: "success",
      });
      addToCart(data.data);
    } else {
      const mainMessage = data.message;
      const message = Object.keys(data.data).map((err) => {
        return (
          <>
            {data.data[err].map((e) => {
              return <li>{e}</li>;
            })}
          </>
        );
      });
      showAlert({
        message: (
          <>
            <p>{mainMessage}</p>
            <ul>{message}</ul>
          </>
        ),
        severity: "error",
      });
    }
  }

  return (
    <Card>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={product.name}
          image={product.image}
          title={product.name}
        />
        <CardContent>
          <Grid
            container
            direction="column"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography gutterBottom variant="h5" component="h2">
                {product.name}
              </Typography>
            </Grid>
            <Grid item>
              <Price gutterBottom variant="h6" component="h2">
                ${product.price_in_usd}
              </Price>
            </Grid>
          </Grid>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.detail}
          </Typography>
        </CardContent>
        <CardActions>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={
                  loading ? <HourglassEmptyIcon /> : <AddShoppingCartIcon />
                }
                onClick={handleAddToCart}
              >
                {loading ? "Adding item..." : "Add to cart"}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </CardActionArea>
    </Card>
  );
}

export async function getServerSideProps(appContext) {
  const { id } = appContext.query;
  const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/products/${id}`);
  const json = await res.json();

  return {
    props: {
      product: json.data,
    },
  };
}

function mapStateToProps(state) {
  const { cartId, user } = state;
  return { cartId, user };
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ addToCart, showAlert }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
