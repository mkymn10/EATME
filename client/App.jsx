import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import FoodItem from './components/FoodItem.jsx';
import FoodLocation from './components/FoodLocation.jsx';
import Recipe from './components/Recipe.jsx';
import ShoppingList from './components/ShoppingList.jsx';
import FindRecipe from './components/FindRecipe.jsx';

const App = (props) => {
  return (
    <div>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/fooditem" element={<FoodItem />} />
        <Route path="/foodlocation" element={<FoodLocation />} />
        <Route path="/recipes" element={<Recipe />} />
        <Route path="/shoppinglist" element={<ShoppingList />} />
        <Route path="/findrecipe" element={<FindRecipe />} />
      </Routes>
      {/* <Routes>
        <Route path='/expired' element={ put jsx element here }></Route>
        <Route path='/location' element={ put jsx element here }></Route>
        <Route path='/eatnow' element={ put jsx element here }></Route>
        <Route path='/' element={<Home /> }></Route>
      </Routes> */}
    </div>
  );
};

export default App;
