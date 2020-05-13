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
import fetch from 'unfetch';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());

const useStyles = makeStyles((theme) => ({
  productPrice: {
    backgroundColor: theme.palette.primary.main,
    color: `white`,
    padding: theme.spacing(1),
  },
}));

function ProductDetail({ product, ...props}) {
  const classes = useStyles();
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(`http://localhost:8000/api/products/${id}`, fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const addToCart = async () => {
    if (typeof data !== 'undefined') {
      const body = {
        cart_id: props.cartId,
        product_id: id,
        total: 1,
        total_price_in_usd: data.data.price_in_usd
      }
  
      const res = await fetch('http://localhost:8000/api/cart_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
  
      const data = await res.json();
      console.log("data", data);
    }
  }

  return (
    <Layout>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            alt={data.data.name}
            image="https://material-ui.com/static/images/cards/paella.jpg"
            title={data.data.name}
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
                  {data.data.name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  className={classes.productPrice}
                >
                  ${data.data.price_in_usd}
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body2" color="textSecondary" component="p">
              {data.data.detail}
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

function mapStateToProps(state) {
  const { cartId } = state
  return { cartId }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ addToCart }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);