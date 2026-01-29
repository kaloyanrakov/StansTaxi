import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async function(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // IMPORTANT: so cookies/session stick
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        window.location.href = "/bookings";
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Wrong password!");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = function(e) {
    setPassword(e.target.value);
  };

  // Create background shapes
  const backgroundShapes = React.createElement(
    'div',
    { className: 'login-background-shapes' },
    React.createElement('div', { className: 'shape shape-1' }),
    React.createElement('div', { className: 'shape shape-2' }),
    React.createElement('div', { className: 'shape shape-3' })
  );

  const background = React.createElement(
    'div',
    { className: 'login-background' },
    backgroundShapes
  );

  const loginLogo = React.createElement(
    'div',
    { className: 'login-logo' },
    React.createElement('i', { className: 'fas fa-taxi' })
  );

  const loginHeader = React.createElement(
    'div',
    { className: 'login-header' },
    loginLogo,
    React.createElement('h2', { className: 'login-title' }, 'Admin Access'),
    React.createElement('p', { className: 'login-subtitle' }, 'Enter your password to continue')
  );

  const inputIcon = React.createElement(
    'i',
    { className: 'input-icon fas fa-lock' }
  );

  const passwordInput = React.createElement(
    'input',
    {
      type: 'password',
      placeholder: 'Enter admin password',
      value: password,
      onChange: handlePasswordChange,
      className: 'login-input',
      required: true,
      disabled: isLoading
    }
  );

  const inputContainer = React.createElement(
    'div',
    { className: 'input-container' },
    inputIcon,
    passwordInput
  );

  const formGroup = React.createElement(
    'div',
    { className: 'form-group' },
    inputContainer
  );

  let buttonContent;
  if (isLoading) {
    buttonContent = [
      React.createElement('div', { className: 'button-spinner', key: 'spinner' }),
      'Authenticating...'
    ];
  } else {
    buttonContent = [
      React.createElement('i', { className: 'fas fa-sign-in-alt', key: 'icon' }),
      'Login to Dashboard'
    ];
  }

  const loginButton = React.createElement(
    'button',
    {
      type: 'submit',
      className: 'login-button' + (isLoading ? ' loading' : ''),
      disabled: isLoading,
      key: 'login-button'
    },
    buttonContent
  );

  const loginForm = React.createElement(
    'form',
    {
      onSubmit: handleLogin,
      className: 'login-form'
    },
    formGroup,
    loginButton
  );

  const securityNote = React.createElement(
    'p',
    { className: 'security-note' },
    React.createElement('i', { className: 'fas fa-shield-alt' }),
    'Secure admin access'
  );

  const loginFooter = React.createElement(
    'div',
    { className: 'login-footer' },
    securityNote
  );

  const loginCard = React.createElement(
    'div',
    { className: 'login-card' },
    loginHeader,
    loginForm,
    loginFooter
  );

  return React.createElement(
    'div',
    { className: 'login-container' },
    background,
    loginCard
  );
}

export default LoginPage;