import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid
} from "@material-ui/core";
import ButtonLink from "../components/ButtonLink";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { showAlert, login } from '../store';
import { useRouter } from "next/router";
import AuthLayout from "../components/AuthLayout";
import { postLogin } from "../lib/api";

function Login(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    const { dispatchLogin, dispatchShowAlert } = props;
    e.preventDefault();
    setLoading(true);
    const data = await postLogin({
      email,
      password
    });
    setLoading(false);
    if (data.success) {
      dispatchLogin(data.data);
      dispatchShowAlert({
        message: data.message,
        severity: "success"
      });
      router.push("/");
    } else {
      const mainMessage = data.message;
      dispatchShowAlert({
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
  bindActionCreators({ dispatchLogin: login, dispatchShowAlert: showAlert }, dispatch)

export default connect(null, mapDispatchToProps)(Login);