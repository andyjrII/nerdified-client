import { useRef, useState, useEffect } from "react";
import "../../assets/styles/signin.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { FcLock, FcAddressBook } from "react-icons/fc";

const AdminSignin = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const errRef = useRef();
  const emailRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "auth/admin_signin",
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const accessToken = response?.data[0]?.access_token;
      const refreshToken = response?.data[0]?.refresh_token;
      const role = response?.data[1];
      localStorage.setItem("ADMIN_REFRESH_TOKEN", refreshToken);
      localStorage.setItem("ADMIN_ACCESS_TOKEN", accessToken);
      localStorage.setItem("ADMIN_EMAIL", email);
      localStorage.setItem("ROLE", role);

      setAuth({ email, accessToken, refreshToken, role });
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Email or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Signin Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <main className="signin-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4 pt-5 mt-5">
            <div className="login-wrap py-4">
              <div
                className="img d-flex align-items-center justify-content-center"
                id="form-image"
              ></div>
              <h3 className="text-center mb-0">Admin Signin</h3>
              <p
                ref={errRef}
                className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}
              >
                {errMsg}
              </p>
              <form
                className="login-form rounded shadow-lg"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span>
                      <FcAddressBook />
                    </span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    ref={emailRef}
                    autoComplete="off"
                    required
                  />
                </div>
                <div className="form-group">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span>
                      <FcLock />
                    </span>
                  </div>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </div>
                <div className="form-group mt-4">
                  <button
                    type="submit"
                    className="btn form-control btn-primary rounded submit px-3"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminSignin;
