import React from 'react';
import LoginForm from './LoginForm';

import './Login.css';

export default function LoginPage() {
  return (
    <div className="container">
      <div className="login-container">
        <h2 className="container-header">Chat Application <br/> (React, ExpressJs & Socket IO) <br/> Login</h2>
        <LoginForm />
      </div>
    </div>
  );
}

