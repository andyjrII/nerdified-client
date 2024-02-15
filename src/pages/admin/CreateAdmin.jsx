import { useRef, useState, useEffect } from "react";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import "../../assets/styles/signin.css";
import {
  faCheck,
  faTimes,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FcLock, FcAddressBook, FcBusinessman } from "react-icons/fc";
import AdminSidebar from "../../components/navigation/AdminSidebar";

const NAME_REGEX = /[A-z-]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[Link-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const CreateAdmin = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const role = localStorage.getItem("ROLE");

  const errRef = useRef();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirm, setValidConfirm] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const result = NAME_REGEX.test(name);
    setValidName(result);
  }, [name]);

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
    setErrMsg("");
  }, [name, email, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = EMAIL_REGEX.test(email);
    const v2 = PASSWORD_REGEX.test(password);
    const v3 = NAME_REGEX.test(name);

    if (!v1 || !v2 || !v3) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      await axiosPrivate.post(
        "admin/create_admin",
        JSON.stringify({
          name,
          email,
          password,
          role
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      const display = "Admin Created! Name: " + name + ", Email: " + email;
      alert(display);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Email Already Exists");
      } else {
        setErrMsg("Registraton Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 pt-5'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-6 col-lg-4'>
              <div className='login-wrap py-4'>
                <div
                  className='img d-flex align-items-center justify-content-center'
                  id='form-image'></div>
                <h3 className='text-center mb-0'>Create Admin</h3>
                <p
                  ref={errRef}
                  className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}>
                  {errMsg}
                </p>
                <form
                  className='login-form rounded shadow-lg'
                  onSubmit={handleSubmit}>
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
                      <span className={validName ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      <span className={validName || !name ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                    </div>
                    <p
                      className={
                        nameFocus && name && !validName
                          ? "instructions"
                          : "offscreen"
                      }>
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
                      <span className={validEmail ? "valid" : "hide"}>
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                      <span
                        className={validEmail || !email ? "hide" : "invalid"}>
                        <FontAwesomeIcon icon={faTimes} />
                      </span>
                    </div>
                    <p
                      className={
                        emailFocus && email && !validEmail
                          ? "instructions"
                          : "offscreen"
                      }>
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
                        className={validPassword ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validPassword || !password ? "hide" : "invalid"
                        }
                      />
                    </div>
                    <p
                      className={
                        passwordFocus && !validPassword
                          ? "instructions"
                          : "offscreen"
                      }>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      8 to 24 characters.
                      <br />
                      Must include uppercase and lowercase letters, Link number
                      and Link special character.
                      <br />
                      Allowed special characters: <span>!</span> <span>@</span>
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
                          validConfirm && confirmPassword ? "valid" : "hide"
                        }
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validConfirm || !confirmPassword ? "hide" : "invalid"
                        }
                      />
                    </div>
                    <p
                      className={
                        confirmFocus && !validConfirm
                          ? "instructions"
                          : "offscreen"
                      }>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Must match the first password input field.
                    </p>
                  </div>

                  <div className='form-group w-100 py-3'>
                    <button
                      className='btn form-control btn-primary rounded px-3'
                      type='submit'
                      disabled={
                        !validName ||
                        !validEmail ||
                        !validPassword ||
                        !validConfirm
                          ? true
                          : false
                      }>
                      Submit Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAdmin;
