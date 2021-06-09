import React from 'react';
import '../styles.css';
import { API } from '../backend';
import Base from './Base';

const Home = () => {
  console.log('...........api...........', API);
  return (
    <Base title='Home Page'>
      <h1 className='text-white'>Hello front end</h1>
    </Base>
  );
};

export default Home;
