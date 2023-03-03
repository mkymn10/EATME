import React, {useState, useEffect} from 'react';
import Navbar from './Navbar.jsx';
import axios from 'axios';


const FoodItem = () => {

  const [result, setResult] = useState([]);
  useEffect(() => {
    const jwt = localStorage.getItem('JWT');
    console.log('HELLO!!!')
    fetch('/api/fooditems', 
    {
      method: 'GET',
      // body: JSON.stringify({ result }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
    }
    )
      .then(res => res.json())
      .then((data) => {
        setResult(data);
      })
      .catch(err => console.log('getDetails: ERROR: ', err));
    // axios.get('api/fooditems').then(response => {
    //   console.log('RESPONSE:', response);
    //   setResult(response);
    // })
  }, [])
  console.log('RESULT:', result);
  function handleSubmit(e) {

  }



  return (
    <div> 
      <Navbar />
      <div className='search-container'>
          <div className='search-container-left'>
            <input className='searchbar' type="text" placeholder='Search'/>
            <button className='search-button'>
              S
            </button>
            <span className='searchBy'>Search By:</span>
            <form>
              <select 
                id="searchValue"
                className='searchBy-dropdown'
              >
                <option value="fridge">
                  fridge
                </option>
              </select>
            </form>
          </div>
        <div className='search-container-right'>
          <span className='add-new'> Add New Food Item: </span>
          <button className='add-button'>
            +
          </button>
        </div>
      </div>
      <div className='display-items'>
        <div className='display-items-category'>Item</div>
        <div className='display-items-category'>Expiration Date</div>
        <div className='display-items-category'>Quantity</div>
        <div className='display-items-category'>Location</div>
        <div className='display-items-category'>Expired</div>
        <div className='item--FoodItem grid-alignment'> 
            <div className='FoodItem-Name-Description'>
              <div className='name-description-container'>
                <p> Name </p>
                <p> Description </p>
              </div>
              <div className='update-delete-container'>
                <button> Update </button>
                <button> Delete </button>
              </div>
            </div>
            <div className='expiration-date-container'>
              1/23/2022
            </div>
        </div>
      </div>
      <div className='show-results'>
        {JSON.stringify(result)}
      </div>
    </div>
  )
}

export default FoodItem;