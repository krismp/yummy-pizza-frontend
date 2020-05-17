import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import fetch from "isomorphic-unfetch";
import getConfig from "next/config";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showAlert, register } from "../store";
import { useRouter } from "next/router";
import AuthLayout from "../components/AuthLayout";
import theme from '../src/theme';

const { publicRuntimeConfig } = getConfig();

function Register(props) {
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        severity: "success",
      });
      router.push("/");
    } else {
      const mainMessage = data.message;
      const message = Object.keys(data.data).map((err) => {
        return (
          <>
            {data.data[err].map((e) => {
              return <li>{e}</li>;
            })}
          </>
        );
      });
      props.showAlert({
        message: (
          <>
            <p>{mainMessage}</p>
            <ul>{message}</ul>
          </>
        ),
        severity: "error",
      });
    }
  };

  return (
    <AuthLayout title="Register">
      <form noValidate onSubmit={handleRegister}>
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
          disabled={loading}
        >
          {loading ? `Submitting...` : `Register`}
        </Button>
      </form>
    </AuthLayout>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ register, showAlert }, dispatch);

export default connect(null, mapDispatchToProps)(Register);
