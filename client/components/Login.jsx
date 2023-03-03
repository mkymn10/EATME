import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
    errorMsg: '',
  });

  function handleChange(event) {
    console.log('STATE UPDATED');
    const { name, value } = event.target;
    setLoginData((prevLoginData) => {
      return {
        ...prevLoginData,
        [name]: value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    // console.log(loginData);

    fetch('/api/authuser/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        // TODO: front end error handling
        if (data.token !== undefined) {
          setLoginData((prevLoginData) => {
            return {
              ...prevLoginData,
              errorMsg: 'none',
            };
          })
          localStorage.setItem('JWT', data.token);
        } else {
          setLoginData((prevLoginData) => {
            return {
              ...prevLoginData,
              errorMsg: data.message,
            };
          })
        }
      })
      .catch((error) => {
        console.log('Error in Login:', error);
      });
  }

  return (
    <div>
      {/* <Navbar /> */}
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Login</h1>
        <div className="form-row">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="text"
            placeholder="Email"
            onChange={handleChange}
            name="email"
            value={loginData.email}
            className="form-input username-input"
          />
        </div>
        <div className="form-row">
          <label htmlFor="password" className="form-label">
            Password:
          </label>
          <input
            type="password"
            placeholder="Password"
            onChange={handleChange}
            name="password"
            value={loginData.password}
            className="form-input password-input"
          />
        </div>
        <button className="login-btn">Login</button>
      </form>
      {loginData.errorMsg === 'none' && (<Navigate to='/fooditem'/>) }
    </div>
  );
};

export default Login;
