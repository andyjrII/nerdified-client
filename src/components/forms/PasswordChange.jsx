import { useRef, useState, useEffect } from 'react';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FcLock } from 'react-icons/fc';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useStudent from '../../hooks/useStudent';
import Swal from 'sweetalert2';
import { SyncLoader } from 'react-spinners';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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
      Swal.fire({
        icon: 'success',
        title: 'Password Changed',
        text: 'Your password has been changed successfully!',
        confirmButtonText: 'OK',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Invalide Credentials');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else if (err.response?.status === 403) {
        setErrMsg('Invalid Password');
      } else {
        setErrMsg('Update Failed');
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errMsg || 'Something went wrong!',
        confirmButtonText: 'OK',
      });
      errRef.current.focus();
    }
    setLoading(false);
  };

  return (
    <div className='password-change-wrap p-4 align-content-center'>
      <h6 className='text-center text-light'>Password Change</h6>
      <p
        ref={errRef}
        className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}
      >
        {errMsg}
      </p>
      <form className='login-form shadow-lg' onSubmit={handleSubmit}>
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
            className='btn btn-primary rounded w-100 py-2'
            type='submit'
            disabled={!validNewPassword || !validConfirm ? true : false}
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
              'Submit'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;
