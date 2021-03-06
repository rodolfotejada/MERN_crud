import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
  //STARTING SETUP///////
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = formData;

  //step 3.1 (REDUX DEPENDENCIES)
  const navigate = useNavigate(); //redirects
  const dispatch = useDispatch(); //sends the action/payload to the authReducer
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    //selects data from the redux store
    (state) => state.auth
  );

  //step 3.2 (USE EFFECT)
  useEffect(() => {
    //a
    if (isError) {
      toast.error(message);
    }
    //b
    if (isSuccess || user) {
      //if the user was created successfully, redirect.
      navigate('/');
    }
    //c
    dispatch(reset()); //to clear the data after creation of new user.
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  //step 1 (ON CHANGE)
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  //step 2 (ON SUBMIT)
  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        //this data is coming from the form.
        name,
        email,
        password,
      };

      dispatch(register(userData)); //here we send the data to auth/register -> service/register (for API call).
    }
  };

  //step 4 (SPINNER)
  if (isLoading) {
    return <Spinner />;
  }

  //FORM SETUP:
  return (
    <>
      <section className='heading'>
        <h1>
          <FaUser /> Register
        </h1>
        <p>Please create an account</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='text'
              className='form-control'
              id='name'
              name='name'
              value={name}
              placeholder='Enter your name'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password2'
              name='password2'
              value={password2}
              placeholder='Confirm password'
              onChange={onChange}
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
