import { useRef, useState, useEffect } from 'react';
import '../assets/styles/signin.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from '../hooks/useAuth';
import { FcLock, FcAddressBook } from 'react-icons/fc';
import db from '../utils/localBase';
import Swal from 'sweetalert2';
import { SyncLoader } from 'react-spinners';

const Signin = () => {
  const { setAuth } = useAuth(); // Ensure useAuth provides setAuth

  const navigate = useNavigate();
  const errRef = useRef();
  const emailRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, password]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axios.post(
        'auth/signin',
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, // <-- Add this line
        }
      );

      const accessToken = response?.data.access_token;
      await db
        .collection('auth_student')
        .doc(email)
        .set({ email, accessToken });

      setAuth({ email, accessToken }); // Set the auth context

      const course = JSON.parse(localStorage.getItem('NERDVILLE_COURSE'));
      if (course) navigate(-1);
      Swal.fire({
        icon: 'success',
        title: 'Signin Success',
        text: 'You have successfully signed in!',
        confirmButtonText: 'OK',
      });
      navigate('/student', { replace: true });
    } catch (err) {
      console.error('Sign-in error:', err); // Log error for debugging
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Signin Failed');
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errMsg || 'Signin Failed!',
        confirmButtonText: 'OK',
      });
      errRef.current.focus();
    }
    setLoading(false);
  };

  return (
    <section className='signin-section pb-5'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 col-lg-4'>
            <div className='login-wrap py-4'>
              <div
                className='img d-flex align-items-center justify-content-center'
                id='form-image'
              ></div>
              <h3 className='text-center mb-0'>Signin</h3>
              <p
                ref={errRef}
                className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}
              >
                {errMsg}
              </p>
              <form
                className='login-form rounded shadow-lg'
                onSubmit={handleSubmit}
              >
                <div className='form-group'>
                  <div className='icon d-flex align-items-center justify-content-center'>
                    <span>
                      <FcAddressBook />
                    </span>
                  </div>
                  <input
                    type='email'
                    className='form-control'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    ref={emailRef}
                    autoComplete='off'
                    required
                  />
                </div>
                <div className='form-group'>
                  <div className='icon d-flex align-items-center justify-content-center'>
                    <span>
                      <FcLock />
                    </span>
                  </div>
                  <input
                    type='password'
                    className='form-control'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </div>
                <div className='form-group d-md-flex'>
                  <div className='w-100 text-md-right p-3'>
                    <Link to='#'>Forgot Password</Link>
                  </div>
                </div>
                <div className='form-group'>
                  <button
                    type='submit'
                    className='btn form-control btn-primary rounded px-3'
                  >
                    {loading ? (
                      <SyncLoader
                        size={20}
                        color='#ffffff'
                        style={{
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
              </form>
              <div className='w-100 text-center mt-4 text'>
                <p className='mb-0'>Don't have an account?</p>
                <Link to='/signup'>Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
