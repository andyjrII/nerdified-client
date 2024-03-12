import { useRef, useState, useEffect } from "react";
import "../assets/styles/student.css";
import "../assets/styles/signin.css";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FcLock } from "react-icons/fc";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useStudent from "../hooks/useStudent";
import { useNavigate } from "react-router-dom";
import StudentRightAside from "../components/navigation/StudentRightAside";
import StudentNavItems from "../components/navigation/StudentNavItems";

const PASSWORD_REGEX =
  /^(?=.*[Link-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const StudentSettings = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const errRef = useRef();

  const email = localStorage.getItem("STUDENT_EMAIL");

  const { student, setStudent } = useStudent();
  const studentId = student.id;

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [validNewPassword, setValidNewPassword] = useState(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validConfirm, setValidConfirm] = useState(false);
  const [confirmFocus, setConfirmFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    const result = PASSWORD_REGEX.test(newPassword);
    setValidNewPassword(result);
    const confirm = newPassword === confirmPassword;
    setValidConfirm(confirm);
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = PASSWORD_REGEX.test(newPassword);
    if (!v1) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const response = await axiosPrivate.patch(
        "auth/password",
        JSON.stringify({
          studentId,
          oldPassword,
          newPassword,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setStudent(response?.data);
      window.alert("Password changed successfully!");
      navigate("/student", { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 403) {
        setErrMsg("Invalid Password");
      } else {
        setErrMsg("Update Failed");
      }
      errRef.current.focus();
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: "arraybuffer", // Set the response type to 'arraybuffer'
      });
      const imageBlob = new Blob([response.data], { type: "image/jpeg" }); // Create a Blob from the binary data
      const imageUrl = URL.createObjectURL(imageBlob); // Create a temporary URL for the image
      setImagePath(imageUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const imageSubmit = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      await axiosPrivate.patch(`students/upload/${studentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(`Image successfully updated!`);
      fetchImage();
      setSelectedImage(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = async (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <section className="row mb-0">
      <aside className="col-md-1 bg-light">
        <StudentNavItems />
      </aside>
      <main className="col-md-9">
        <div className="container pt-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="login-wrap py-4">
                <div
                  className="img d-flex align-items-center justify-content-center"
                  id="form-image"
                ></div>
                <h3 className="text-center mb-0">Password Change</h3>
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
                      <span className="fa fa-lock">
                        <FcLock />
                      </span>
                    </div>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      onChange={(e) => setOldPassword(e.target.value)}
                      value={oldPassword}
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
                      placeholder="New Password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      required
                      onFocus={() => setNewPasswordFocus(true)}
                      onBlur={() => setNewPasswordFocus(false)}
                    />
                    <div className="valid-icon d-flex align-items-center justify-content-center">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className={validNewPassword ? "valid" : "hide"}
                      />
                      <FontAwesomeIcon
                        icon={faTimes}
                        className={
                          validNewPassword || !newPassword ? "hide" : "invalid"
                        }
                      />
                    </div>
                    <p
                      className={
                        newPasswordFocus && !validNewPassword
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />8 to 24 characters.
                      Must include uppercase & lowercase letters,a number & a
                      special character.Allowed special characters:{" "}
                      <span>!</span> <span>@</span>
                      <span>#</span> <span>$</span> <span>%</span>
                    </p>
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
                      placeholder="Confirm Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      required
                      onFocus={() => setConfirmFocus(true)}
                      onBlur={() => setConfirmFocus(false)}
                    />
                    <div className="valid-icon d-flex align-items-center justify-content-center">
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
                      }
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Must match the first password input field.
                    </p>
                  </div>

                  <div className="form-group w-100 py-3">
                    <button
                      className="btn form-control btn-primary rounded px-3"
                      type="submit"
                      disabled={
                        !validNewPassword || !validConfirm ? true : false
                      }
                    >
                      Submit Form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <form>
            <label className="image-label mt-5" title="Upload Image">
              <input
                type="file"
                className="form-control"
                id="image-input"
                onChange={handleImageChange}
                accept="image/*"
              />
              <img
                src={imagePath}
                alt="Student"
                className="img-fluid"
                id="student-image"
              />
            </label>
            <button
              className="btn btn-lg tomato text-white"
              onClick={() => imageSubmit()}
            >
              Submit
            </button>
          </form>
        </div>
      </main>
      <aside className="col-md-2">
        <StudentRightAside />
      </aside>
    </section>
  );
};

export default StudentSettings;
