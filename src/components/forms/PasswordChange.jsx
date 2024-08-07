import { useRef, useState, useEffect } from 'react';
import '../../assets/styles/signin.css';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FcLock } from 'react-icons/fc';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useStudent from '../../hooks/useStudent';

const PASSWORD_REGEX =
  /^(?=.*[Link-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const PasswordChange = () => {
  const axiosPrivate = useAxiosPrivate();
  const errRef = useRef();

  const { student, setStudent } = useStudent();
  const studentId = student.id;

  const [oldPassword, setOldPassword] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [validNewPassword, setValidNewPassword] = useState(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirm, setValidConfirm] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const result = PASSWORD_REGEX.test(newPassword);
    setValidNewPassword(result);
    const confirm = newPassword === confirmPassword;
    setValidConfirm(confirm);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setErrMsg('');
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = PASSWORD_REGEX.test(newPassword);
    if (!v1) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const response = await axiosPrivate.patch(
        'auth/password',
        JSON.stringify({
          studentId,
          oldPassword,
          newPassword,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setStudent(response?.data);
      window.alert('Password changed successfully!');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 403) {
        setErrMsg('Invalid Password');
      } else {
        setErrMsg('Update Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div className='student-wrap py-4'>
      <p
        ref={errRef}
        className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}
      >
        {errMsg}
      </p>
      <form className='login-form rounded shadow-lg' onSubmit={handleSubmit}>
        <div className='form-group'>
          <div className='icon d-flex align-items-center justify-content-center'>
            <span className='fa fa-lock'>
              <FcLock />
            </span>
          </div>
          <input
            type='password'
            className='form-control'
            placeholder='Password'
            onChange={(e) => setOldPassword(e.target.value)}
            value={oldPassword}
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
            placeholder='New Password'
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            required
            onFocus={() => setNewPasswordFocus(true)}
            onBlur={() => setNewPasswordFocus(false)}
          />
          <div className='valid-icon d-flex align-items-center justify-content-center'>
            <FontAwesomeIcon
              icon={faCheck}
              className={validNewPassword ? 'valid' : 'hide'}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validNewPassword || !newPassword ? 'hide' : 'invalid'}
            />
          </div>
          <p
            className={
              newPasswordFocus && !validNewPassword
                ? 'instructions'
                : 'offscreen'
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />8 to 24 characters. Must
            include uppercase & lowercase letters,a number & a special
            character.Allowed special characters: <span>!</span> <span>@</span>
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
              className={validConfirm && confirmPassword ? 'valid' : 'hide'}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validConfirm || !confirmPassword ? 'hide' : 'invalid'}
            />
          </div>
          <p
            className={
              confirmFocus && !validConfirm ? 'instructions' : 'offscreen'
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>
        </div>

        <div className='mt-2'>
          <button
            className='btn btn-primary rounded w-100'
            type='submit'
            disabled={!validNewPassword || !validConfirm ? true : false}
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
