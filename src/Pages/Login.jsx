import React from "react";
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <div>
      <h1>Login Page</h1>
      <LoginForm onLogin={() => (window.location.href = "/dashboard")} />
    </div>
  );
}

export default Login;
