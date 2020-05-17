import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ButtonLink from "../components/ButtonLink";
import Grid from "@material-ui/core/Grid";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { showAlert, login } from '../store';
import { useRouter } from "next/router";
import AuthLayout from "../components/AuthLayout";

const { publicRuntimeConfig } = getConfig();

function Login(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${publicRuntimeConfig.API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (data.success) {
      props.login(data.data);
      props.showAlert({
        message: data.message,
        severity: "success"
      });
      router.push("/");
    } else {
      const mainMessage = data.message;
      props.showAlert({
        message: (<>
          <p>{mainMessage}</p>
        </>),
        severity: "error"
      });
    }
  }

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleLogin} noValidate>
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
        >
          { loading ? 'Submitting' : 'Sign In' }
        </Button>
        <Grid container>
          <Grid item>
            <Button component={ButtonLink} href="/register">
              {"Don't have an account? Sign Up"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ login, showAlert }, dispatch)

export default connect(null, mapDispatchToProps)(Login);