import React from "react";
import Link from 'next/link'
import Grid from "@material-ui/core/Grid";
import Product from "../components/Product";
import { getProducts } from "../lib/api";

function Index({ products }) {
  return (
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
            <a><Product name={product.name} price={product.price_in_usd} image={product.image} /></a>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export async function getServerSideProps() {
  const json = await getProducts();

  return {
    props: {
      products: json.data
    }
  }
}

export default Index;