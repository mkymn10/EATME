import React from 'react';
// import axios from 'axios';
// const result = axios.get('/api/fooditems')
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <span> EATME </span>
        <img alt='../images/akimichi-logo.png' src="../images/akimichi-logo.png" className="nav-logo" />
      </ul>
      <ul className="nav-categories">
        <Link to="/fooditem">
          {' '}
          <li> All Food Items </li>{' '}
        </Link>
        <Link to="/foodlocation">
          {' '}
          <li> Locations </li>{' '}
        </Link>
        <Link to="/recipes">
          {' '}
          <li> Recipes </li>{' '}
        </Link>
        <Link to="/shoppinglist">
          {' '}
          <li> Shopping List </li>{' '}
        </Link>
        <Link to="/findrecipe">
          {' '}
          <li> Find Recipe </li>{' '}
        </Link>
        <li>
          {' '}
          <button className="logout-button"> Logout </button>{' '}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
