import React from "react";
import Link from 'next/link'
import Grid from "@material-ui/core/Grid";
import Layout from "../components/layout";
import Product from "../components/product";
import fetch from 'unfetch';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(r => r.json());

function Index() {
  const { data, error } = useSWR('http://localhost:8000/api/products', fetcher)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  
  return (
    <Layout>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        spacing={5}
      >
        {(data && data.data.length) > 0 && data.data.map(product => (
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

export default Index;