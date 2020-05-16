import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
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
  const [orders, setOrders] = useState([]);
  const classes = useStyles();

  const fetchOrders = async () => {
    const result = await fetch(`${publicRuntimeConfig.API_BASE_URL}/orders?user_id=${props.user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.user.token}`
      },
    });

    const json = await result.json();
    setOrders(json.data);
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
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 && <TableRow>
                <TableCell align="center" colSpan={5}>
                  You don't have any order
                </TableCell>
            </TableRow>}
            {orders.length > 0 && orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell align="right">{order.created_at}</TableCell>
                <TableCell component="th" scope="row">
                    <ul>
                      {order.items.map(item => (
                        <li>{item.name}: {item.total} pc(s)</li>
                      ))}
                    </ul>
                </TableCell>
                <TableCell align="right">{order.total_items}</TableCell>
                <TableCell align="right">${order.total_cart_price_in_usd}</TableCell>
                <TableCell align="right">{order.status}</TableCell>
              </TableRow>
            ))}
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