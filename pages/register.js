import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Layout from "../components/layout";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { showAlert, register } from '../store';
import { useRouter } from "next/router";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Yummy Pizza
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const { publicRuntimeConfig } = getConfig();

function Register(props) {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        c_password: confirmPassword,
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (data.success) {
      props.register(data.data);
      props.showAlert({
        message: data.message,
        severity: "success"
      });
      router.push("/");
    } else {
      const mainMessage = data.message;
      const message = Object.keys(data.data).map(err => {
        return <>
          {data.data[err].map(e => {
            return <li>{e}</li>
          })}
        </>
      });
      props.showAlert({
        message: (<>
          <p>{mainMessage}</p>
          <ul>{message}</ul>
        </>),
        severity: "error"
      });
    }
  }

  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <AssignmentIndIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleRegister}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password_confirmation"
              label="Confirm Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Layout>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ register, showAlert }, dispatch)

export default connect(null, mapDispatchToProps)(Register);