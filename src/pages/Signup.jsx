import { useRef, useState, useEffect } from 'react';
import '../assets/styles/signin.css';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  FcLock,
  FcAddressBook,
  FcBusinessman,
  FcHome,
  FcPhone,
  FcImageFile,
} from 'react-icons/fc';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import db from '../utils/localBase';
import useAuth from '../hooks/useAuth';
import Swal from 'sweetalert2';
import DPDefault from '../assets/images/navpages/person_profile.jpg';

const NAME_REGEX = /[A-z-]{3,20}$/;
const PHONE_REGEX = /[0-9]{11}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[Link-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Signup = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const errRef = useRef();

  const [name, setName] = useState('');
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [phone, setPhone] = useState('');
  const [validPhone, setValidPhone] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirm, setValidConfirm] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [address, setAddress] = useState('');
  const [validAddress, setValidAddress] = useState(false);
  const [addressFocus, setAddressFocus] = useState(false);

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const result = NAME_REGEX.test(name);
    setValidName(result);
  }, [name]);

  useEffect(() => {
    const result = PHONE_REGEX.test(phone);
    setValidPhone(result);
  }, [phone]);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    setValidPassword(result);
    const confirm = password === confirmPassword;
    setValidConfirm(confirm);
  }, [password, confirmPassword]);

  useEffect(() => {
    const result = NAME_REGEX.test(address);
    setValidAddress(result);
  }, [address]);

  useEffect(() => {
    setErrMsg('');
  }, [name, phone, email, password, confirmPassword, address]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImageFile(file.name);

    // Create an image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set image preview
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = EMAIL_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);
    const v3 = NAME_REGEX.test(name);
    const v4 = PHONE_REGEX.test(phone);
    const v5 = NAME_REGEX.test(address);

    if (!v1 || !v2 || !v3 || !v4 || !v5) {
      setErrMsg('Invalid Entry');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phoneNumber', phone);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('address', address);
      formData.append('image', image); // Add image file

      const response = await axios.post('auth/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const accessToken = response?.data.access_token;
      await db
        .collection('auth_student')
        .doc(email)
        .set({ email, accessToken });
      setAuth({ email, accessToken });

      Swal.fire({
        icon: 'success',
        title: 'Signup Success',
        text: 'You have successfully signed up!',
        confirmButtonText: 'OK',
      });

      navigate('/student', { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Email Already Exists');
      } else {
        setErrMsg('Registration Failed');
      }

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errMsg || 'Something went wrong!',
        confirmButtonText: 'OK',
      });
      errRef.current.focus();
    }
  };

  return (
    <section className='signin-section'>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-7'>
            <div className='login-wrap py-4'>
              <div
                className='img d-flex align-items-center justify-content-center'
                id='form-image'
              ></div>
              <h3 className='text-center mb-0'>Student Registration</h3>
              <p
                ref={errRef}
                className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}
              >
                {errMsg}
              </p>
              <form className='rounded shadow-lg' onSubmit={handleSubmit}>
                <div className='row mt-2'>
                  <div className='col-md-7 login-form'>
                    <div className='form-group'>
                      <div className='icon d-flex align-items-center justify-content-center'>
                        <span>
                          <FcBusinessman />
                        </span>
                      </div>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Names'
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        autoComplete='off'
                        required
                        onFocus={() => setNameFocus(true)}
                        onBlur={() => setNameFocus(false)}
                      />
                      <div className='valid-icon d-flex align-items-center justify-content-center'>
                        <span className={validName ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className={validName || !name ? 'hide' : 'invalid'}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </div>
                      <p
                        className={
                          nameFocus && name && !validName
                            ? 'instructions'
                            : 'offscreen'
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Last Name followed by Other Names e.g. Andy James
                      </p>
                    </div>

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
                        autoComplete='off'
                        required
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                      />
                      <div className='valid-icon d-flex align-items-center justify-content-center'>
                        <span className={validEmail ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className={validEmail || !email ? 'hide' : 'invalid'}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </div>
                      <p
                        className={
                          emailFocus && email && !validEmail
                            ? 'instructions'
                            : 'offscreen'
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a valid Email address e.g. andyjames@gmail.com
                      </p>
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
                        onFocus={() => setPasswordFocus(true)}
                        onBlur={() => setPasswordFocus(false)}
                      />
                      <div className='valid-icon d-flex align-items-center justify-content-center'>
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={validPassword ? 'valid' : 'hide'}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validPassword || !password ? 'hide' : 'invalid'
                          }
                        />
                      </div>
                      <p
                        className={
                          passwordFocus && !validPassword
                            ? 'instructions'
                            : 'offscreen'
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.
                        <br />
                        Must include uppercase and lowercase letters, Link
                        number and Link special character.
                        <br />
                        Allowed special characters: <span>!</span>{' '}
                        <span>@</span>
                        <span>#</span> <span>$</span> <span>%</span>
                      </p>
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
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        required
                        onFocus={() => setConfirmFocus(true)}
                        onBlur={() => setConfirmFocus(false)}
                      />
                      <div className='valid-icon d-flex align-items-center justify-content-center'>
                        <FontAwesomeIcon
                          icon={faCheck}
                          className={
                            validConfirm && confirmPassword ? 'valid' : 'hide'
                          }
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          className={
                            validConfirm || !confirmPassword
                              ? 'hide'
                              : 'invalid'
                          }
                        />
                      </div>
                      <p
                        className={
                          confirmFocus && !validConfirm
                            ? 'instructions'
                            : 'offscreen'
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                      </p>
                    </div>

                    <div className='form-group'>
                      <div className='icon d-flex align-items-center justify-content-center'>
                        <span>
                          <FcHome />
                        </span>
                      </div>
                      <input
                        type='text'
                        className='form-control'
                        placeholder='Address'
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        autoComplete='off'
                        required
                        onFocus={() => setAddressFocus(true)}
                        onBlur={() => setAddressFocus(false)}
                      />
                      <div className='valid-icon d-flex align-items-center justify-content-center'>
                        <span className={validAddress ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className={
                            validAddress || !address ? 'hide' : 'invalid'
                          }
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </div>
                      <p
                        className={
                          addressFocus && address && !validAddress
                            ? 'instructions'
                            : 'offscreen'
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a valid Addres - City, State & Country.
                      </p>
                    </div>

                    <div className='form-group'>
                      <div className='icon d-flex align-items-center justify-content-center'>
                        <span>
                          <FcPhone />
                        </span>
                      </div>
                      <input
                        className='form-control'
                        placeholder='Phone Number'
                        value={phone}
                        autoComplete='off'
                        type='tel'
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setPhoneFocus(true)}
                        onBlur={() => setPhoneFocus(false)}
                        required
                      />
                      <div className='valid-icon d-flex align-items-center justify-content-center'>
                        <span className={validPhone ? 'valid' : 'hide'}>
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                        <span
                          className={validPhone || !phone ? 'hide' : 'invalid'}
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </span>
                      </div>
                      <p
                        className={
                          phoneFocus && phone && !validPhone
                            ? 'instructions'
                            : 'offscreen'
                        }
                      >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Enter a valid Phone Number.
                      </p>
                    </div>
                  </div>

                  <div className='col-md-5 login-form justify-content-center align-content-center'>
                    <div className='form-group'>
                      <div className='custom-file-input mt-3'>
                        {/* Image preview */}
                        <div className='image-preview mb-2'>
                          <img
                            src={imagePreview || DPDefault}
                            alt='Selected'
                            style={{
                              width: '100%',
                              height: '220px',
                              borderRadius: '8px',
                            }}
                          />
                        </div>
                        <input
                          type='file'
                          id='file-input'
                          className='file-input'
                          accept='image/*'
                          onChange={handleFileChange}
                          required
                        />
                        <label
                          htmlFor='file-input'
                          className='custom-file-label'
                        >
                          <div className='d-flex align-items-center justify-content-center'>
                            <FcImageFile id='image-icon' />
                          </div>
                          {imageFile || 'Choose an image'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='row mx-auto form-group w-50 py-3'>
                  <button
                    className='btn form-control btn-primary rounded px-3'
                    type='submit'
                    disabled={
                      !validName ||
                      !validPhone ||
                      !validEmail ||
                      !validPassword ||
                      !validConfirm ||
                      !validAddress
                        ? true
                        : false
                    }
                  >
                    Submit Form
                  </button>
                </div>
              </form>
              <div className='w-100 text-center mt-2 text'>
                <p className='mb-0'>Already have an account?</p>
                <Link to='/signin'>Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
