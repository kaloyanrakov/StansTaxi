import React, { useState } from "react";
import "./LoginPage.css";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = function(e) {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(function() {
      if (password === "admin123") {
        // Redirect to bookings page
        window.location.href = "/bookings";
      } else {
        alert("Wrong password!");
      }
      setIsLoading(false);
    }, 800);
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

  // Create login logo
  const loginLogo = React.createElement(
    'div',
    { className: 'login-logo' },
    React.createElement('i', { className: 'fas fa-taxi' })
  );

  // Create login header
  const loginHeader = React.createElement(
    'div',
    { className: 'login-header' },
    loginLogo,
    React.createElement('h2', { className: 'login-title' }, 'Admin Access'),
    React.createElement('p', { className: 'login-subtitle' }, 'Enter your password to continue')
  );

  // Create input icon
  const inputIcon = React.createElement(
    'i',
    { className: 'input-icon fas fa-lock' }
  );

  // Create password input
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

  // Create button content based on loading state
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

  // Create login button
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

  // Create login form
  const loginForm = React.createElement(
    'form',
    {
      onSubmit: handleLogin,
      className: 'login-form'
    },
    formGroup,
    loginButton
  );

  // Create security note
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

  // Create main login card
  const loginCard = React.createElement(
    'div',
    { className: 'login-card' },
    loginHeader,
    loginForm,
    loginFooter
  );

  // Create main container
  return React.createElement(
    'div',
    { className: 'login-container' },
    background,
    loginCard
  );
}

export default LoginPage;