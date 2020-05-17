import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addToCart, showAlert } from "../../store";
import theme from "../../src/theme";
import Chip from '@material-ui/core/Chip';
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { getProductDetail, postAddToCart } from "../../lib/api";

const Price = withStyles({
  root: {
    fontSize: `18px`,
    marginBottom: theme.spacing(2)
  }
})(Chip);

function ProductDetail(props) {
  const [loading, setLoading] = useState(false);
  const { product, cartId, dispatchShowAlert, dispatchAddToCart, user } = props;

  async function handleAddToCart() {
    setLoading(true);
    const data = await postAddToCart({
      userId: user.id,
      cartId: cartId,
      productId: product.id,
      total: 1,
      price: parseFloat(product.price_in_usd),
    });
    setLoading(false);
    if (data.success) {
      dispatchShowAlert({
        message: data.message,
        severity: "success",
      });
      dispatchAddToCart(data.data);
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
      dispatchShowAlert({
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
              <Price
                label={product.price_in_usd}
                color="primary"
                size="medium"
                icon={<AttachMoneyIcon />}
              />
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
  const json = await getProductDetail(id);

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
  bindActionCreators({ dispatchAddToCart: addToCart, dispatchShowAlert: showAlert }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
