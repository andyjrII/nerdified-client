import AdminSidebar from "../../components/navigation/AdminSidebar";
import { useRef, useState, useEffect } from "react";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import "../../assets/styles/admin.css";
import axios from "../../api/axios";

const UpdateCourse = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const errRef = useRef();

  const courseId = localStorage.getItem("EDIT_COURSE_ID");
  const [title, setTitle] = useState(undefined);
  const [description, setDescription] = useState();
  const [price, setPrice] = useState();
  const [level, setLevel] = useState(undefined);
  const [deadline, setDeadline] = useState(undefined);
  const [course, setCourse] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [errMsg, setErrMsg] = useState();

  useEffect(() => {
    getCourse();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [title, description, price, level, deadline, courseId, selectedFile]);

  const handleSelect = (e) => {
    setLevel(e.target.value);
  };

  const handleTextarea = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const getCourse = async () => {
    try {
      const response = await axios.get(`courses/course/${courseId}`);
      if (!response.data) alert("Course does not exist");
      setCourse(response?.data);
    } catch (err) {
      setErrMsg("Error Occured!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.patch(
        `courses/update/${courseId}`,
        JSON.stringify({ title, description, price, level, deadline }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (selectedFile) await fileUpload(response?.data.id);
      setCourse(response?.data);
      alert(`${course.title} successfully updated!`);
      setErrMsg("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Course with title already exists");
      } else if (err.response?.status === 403) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Update Failed");
      }
      errRef.current.focus();
    }
  };

  const fileUpload = async (id) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axios.patch(`courses/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        responseType: "arraybuffer", // Specify that the response should be treated as binary data
      });
    } catch (err) {
      setErrMsg("Document upload Failed");
      errRef.current.focus();
    }
  };

  return (
    <div id="wrapper">
      <AdminSidebar />
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="pt-3 pb-2 mb-3 border-bottom">
          <h1 className="text-center">Update Course</h1>
        </div>

        <div className="p-3 pb-md-4 mx-auto row">
          {/* Form for updating course */}
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-sm-7">
                <div className="input-group mb-2">
                  <span
                    className="input-group-text bg-dark text-white"
                    id="course-title"
                  >
                    Title
                  </span>
                  <input
                    type="text"
                    className="form-control bg-dark text-white"
                    placeholder={course.title}
                    aria-label="Course Title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </div>
              </div>

              <div className="col-sm-5">
                <div className="input-group mb-2">
                  <select
                    className="form-select bg-dark text-white"
                    id="level"
                    value={level}
                    onChange={handleSelect}
                  >
                    <option>{course.level}</option>
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                  <span
                    className="input-group-text bg-dark text-white"
                    id="level"
                  >
                    Level
                  </span>
                </div>
              </div>

              <div className="input-group">
                <span className="input-group-text bg-dark text-white">
                  Description
                </span>
                <textarea
                  className="form-control bg-dark text-white"
                  aria-label="Description"
                  value={description}
                  onChange={handleTextarea}
                  defaultValue={course.description}
                />
              </div>

              <div className="col-sm-3">
                <div className="input-group mb-2">
                  <span className="input-group-text bg-dark text-white">
                    &#8358;
                  </span>
                  <input
                    type="number"
                    className="form-control bg-dark text-white"
                    aria-label="Price (to the nearest Naira)"
                    placeholder={course.price}
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                  />
                  <span className="input-group-text bg-dark text-white">
                    .00
                  </span>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="input-group mb-2">
                  <span
                    className="input-group-text bg-dark text-white"
                    id="start-date"
                  >
                    Start Date
                  </span>
                  <input
                    type="date"
                    className="form-control bg-dark text-white"
                    id="start-date"
                    onChange={(e) => setDeadline(e.target.value)}
                    value={deadline}
                  />
                </div>
              </div>

              <div className="col-sm-5">
                <div className="input-group mb-2">
                  <span
                    className="input-group-text bg-dark text-white"
                    id="file"
                  >
                    Course Outline
                  </span>
                  <input
                    type="file"
                    className="form-control bg-dark text-white"
                    id="file"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="text-center">
                <button className="btn bg-danger text-white btn-lg w-50">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UpdateCourse;
