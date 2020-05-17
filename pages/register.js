import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { showAlert, register } from "../store";
import { useRouter } from "next/router";
import AuthLayout from "../components/AuthLayout";
import { postRegister } from "../lib/api";

function Register(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    const { dispatchRegister, dispatchShowAlert } = props;
    e.preventDefault();
    setLoading(true);
    const data = await postRegister({
      name,
      email,
      password,
      confirmPassword,
    });
    setLoading(false);
    if (data.success) {
      dispatchRegister(data.data);
      dispatchShowAlert({
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
      dispatchShowAlert({
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
  bindActionCreators({ dispatchRegister: register, dispatchShowAlert: showAlert }, dispatch);

export default connect(null, mapDispatchToProps)(Register);
