import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Layout from "../../components/layout";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addToCart } from '../../store';
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch';

const useStyles = makeStyles((theme) => ({
  productPrice: {
    backgroundColor: theme.palette.primary.main,
    color: `white`,
    padding: theme.spacing(1),
  },
}));

function ProductDetail(props) {
  const classes = useStyles();
  const { product, cartId } = props;

  const addToCart = async () => {
    const body = JSON.stringify({
      cart_id: cartId,
      product_id: product.id,
      total: 1,
      total_price_in_usd: parseFloat(product.price_in_usd)
    })

    const res = await fetch('https://krismp-yummy-pizza-backend.herokuapp.com/api/cart_items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log("data", data);

    const data = await res.json();
  }

  return (
    <Layout>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            alt={product.name}
            image="https://material-ui.com/static/images/cards/paella.jpg"
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
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  className={classes.productPrice}
                >
                  ${product.price_in_usd}
                </Typography>
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
                  className={classes.button}
                  startIcon={<AddShoppingCartIcon />}
                  onClick={addToCart}
                >
                  Add to cart
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </CardActionArea>
      </Card>
    </Layout>
  );
}

ProductDetail.getInitialProps = async (appContext) => {
  const { id } = appContext.query;
  const res = await fetch(`https://krismp-yummy-pizza-backend.herokuapp.com/api/products/${id}`);
  const json = await res.json();

  return {
    product: json.data
  }
}

function mapStateToProps(state) {
  const { cartId } = state
  return { cartId }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addToCart }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);