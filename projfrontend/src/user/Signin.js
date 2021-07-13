import React, { useState } from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';

const signinForm = () => {
  return (
    <div className='col-md-6 offset-sm-3 text-left'>
      <form>
        <div className='form-group my-3'>
          <label className='text-light'>Email</label>
          <input className='form-control' type='email' />
        </div>
        <div className='form-group my-3'>
          <label className='text-light'>Password</label>
          <input className='form-control' type='password' />
        </div>
        <button className='btn my-3 btn-success btn-block form-control'>Submit</button>
      </form>
    </div>
  );
};

const Signin = () => {
  return (
    <Base title='Sign in page' description='A page for user to sign up'>
      {signinForm()}
    </Base>
  );
};

export default Signin;
