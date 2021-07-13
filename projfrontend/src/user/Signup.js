import React, { useState } from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';
import { signup } from '../auth/helper';

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    success: false
  });
  const { name, email, password, error, success } = values;

  const handleChange = event => {
    setValues({ ...values, error: false, [event.target.name]: event.target.value });
  };

  const handleSubmmit = event => {
    event.preventDefault();
    setValues({ ...values, error: false });
    signup({ name, email, password })
      .then(data => {
        console.log('data', data);
        if (data.errors) setValues({ ...values, error: data.errors[0].msg, success: false });
        else {
          setValues({ ...values, name: '', email: '', password: '', error: '', success: true });
        }
      })
      .catch(err => console.log('Error in signup', err));
  };

  const successMessage = () => (
    <div className='col-md-6 offset-sm-3 text-left'>
      <div className='alert alert-success' style={{ display: success ? '' : 'none' }}>
        New Account was Created Successfully. Please <Link to='/signin'>Login Here</Link>
      </div>
    </div>
  );

  const errorMessage = () => (
    <div className='col-md-6 offset-sm-3 text-left'>
      <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
        {error}
      </div>
    </div>
  );

  const signupForm = () => {
    return (
      <div className='col-md-6 offset-sm-3 text-left'>
        <form onSubmit={handleSubmmit}>
          <div className='form-group my-3'>
            <label className='text-light'>Name</label>
            <input name='name' className='form-control' type='text' onChange={handleChange} value={name} />
          </div>
          <div className='form-group my-3'>
            <label className='text-light'>Email</label>
            <input name='email' className='form-control' type='email' onChange={handleChange} value={email} />
          </div>
          <div className='form-group my-3'>
            <label className='text-light'>Password</label>
            <input name='password' className='form-control' type='password' onChange={handleChange} value={password} />
          </div>
          <button className='btn my-3 btn-success btn-block form-control' type='submit'>
            Submit
          </button>
        </form>
      </div>
    );
  };
  return (
    <Base title='Sign up page' description='A page for user to sign up'>
      {successMessage()}
      {errorMessage()}
      {signupForm()}
    </Base>
  );
};

export default Signup;
