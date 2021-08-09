import React from 'react';
import RegisterForm from './RegisterForm';

import './Register.css';

export default function RegisterPage() {
  return (
    <div className="container">
      <div className="login-container">
        <h2 className="container-header">Chat Application <br/> (React, ExpressJs & Socket IO) <br/> Register</h2>
        <RegisterForm />
      </div>
    </div>
  );
}

