import React from "react";
import Link from 'next/link'
import Grid from "@material-ui/core/Grid";
import Layout from "../components/layout";
import Product from "../components/product";
import fetch from 'isomorphic-unfetch';

function Index({ products }) {
  return (
    <Layout>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        spacing={5}
      >
        {(products.length) > 0 && products.map(product => (
          <Grid item xs={12} lg={6} key={product.id}>
            <Link href={`/products/[id]`} as={`/products/${product.id}`}>
              <a><Product name={product.name} price={product.price_in_usd} /></a>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

Index.getInitialProps = async (appContext) => {
  const res = await fetch(`https://krismp-yummy-pizza-backend.herokuapp.com/api/products`);
  const json = await res.json();

  return {
    products: json.data
  }
}

export default Index;