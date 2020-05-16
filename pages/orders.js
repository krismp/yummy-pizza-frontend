import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Layout from '../components/layout';
import fetch from "isomorphic-unfetch";
import { connect } from 'react-redux';
import getConfig from "next/config";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  }
});

const { publicRuntimeConfig } = getConfig();

function Order(props) {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const classes = useStyles();

  const fetchOrders = async () => {
    setLoading(true);
    const result = await fetch(`${publicRuntimeConfig.API_BASE_URL}/orders?user_id=${props.user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.user.token}`
      },
    });

    const json = await result.json();
    setOrders(json.data);
    setLoading(false);
  }

  useEffect(() => {
    if (props.isLoggedIn) {
      fetchOrders();
    }
  }, []);

  return (
    <Layout>
      <Typography gutterBottom variant="h5" component="h2">
        {props.isLoggedIn ? `Hi ${props.user.name}, this is your last 5 order history:` : `You need to login to see your order history.`}
      </Typography>
      {props.isLoggedIn && <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Order Date</TableCell>
              <TableCell>Item(s)</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Total Items</TableCell>
              <TableCell align="right">Delivery Cost</TableCell>
              <TableCell align="right">Final Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!loading && orders.length > 0) ? orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell align="right">{order.created_at}</TableCell>
                <TableCell component="th" scope="row">
                    <ul>
                      {order.items.map(item => (
                        <li>
                          <Link href={`/products/[id]`} as={`/products/${item.id}`}>
                            <a>{item.name}: {item.total} pc(s) - ${item.unit_price}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                </TableCell>
                <TableCell align="right">{order.status}</TableCell>
                <TableCell align="right">{order.total_items}</TableCell>
                <TableCell align="right">${order.delivery_cost_in_usd}</TableCell>
                <TableCell align="right">${order.final_price_in_usd}</TableCell>
              </TableRow>
            )) : <TableRow>
              <TableCell align="center" colSpan={5}>
                {loading ? <CircularProgress/> : `You don't have any order`}
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>}
    </Layout>
  );
}

function mapStateToProps(state) {
  const { user, isLoggedIn } = state
  return { user, isLoggedIn }
}

export default connect(mapStateToProps)(Order);