import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 375,
    margin: `1rem auto`,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  productInfo: {
    textAlign: `center`,
  },
  productPrice: {
    color: theme.palette.text.secondary,
    padding: theme.spacing(1),
  },
}));

export default function Product({ name, price }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image="https://material-ui.com/static/images/cards/paella.jpg"
        title="Paella dish"
      />
      <CardContent className={classes.productInfo}>
        <Typography gutterBottom variant="h5" component="h2">
          {name}
        </Typography>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          className={classes.productPrice}
        >
          ${price}
        </Typography>
      </CardContent>
    </Card>
  );
}
