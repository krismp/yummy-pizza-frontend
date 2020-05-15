import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';
import Layout from '../components/layout';
import { connect } from 'react-redux';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  pagination: {
    padding: `3rem 0`,
    height: `2rem`
  }
});

function createData(name, calories, fat, carbs, orderedAt) {
  return { name, calories, fat, carbs, orderedAt };
}

const rows = [
  createData('Frozen yoghurt', 2, `$6.0`, "Completed", "2020-04-12"),
  createData('Ice cream sandwich', 2, `$9.0`, "Completed", "2020-04-12"),
  createData('Eclair', 2, `$16.0`, "Completed", "2020-04-12"),
  createData('Cupcake', 1, `$3.7`, "Completed", "2020-04-12"),
  createData('Gingerbread', 1, `$16.0`, "Completed", "2020-04-12"),
];

function Order(props) {
  const classes = useStyles();

  return (
    <Layout>
      <Typography gutterBottom variant="h5" component="h2">
        {props.isLoggedIn ? `Hi ${props.user.name}, this is your last 5 order history:` : `You need to login to see your order history.`}
      </Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Menus</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Ordered At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                  {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.orderedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination count={10} variant="outlined" color="primary" className={classes.pagination} />
      </TableContainer>
    </Layout>
  );
}

function mapStateToProps(state) {
  const { user, isLoggedIn } = state
  return { user, isLoggedIn }
}

export default connect(mapStateToProps)(Order);