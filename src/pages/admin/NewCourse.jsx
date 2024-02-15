import AdminSidebar from "../../components/navigation/AdminSidebar";
import { useRef, useState, useEffect } from "react";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import "../../assets/styles/admin.css";

const NewCourse = () => {
  const errRef = useRef();

  const axiosPrivate = useAdminAxiosPrivate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [level, setLevel] = useState("");
  const [deadline, setDeadline] = useState("");
  const [course, setCourse] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [title, description, price, level, deadline, selectedFile]);

  const handleSelect = (e) => {
    setLevel(e.target.value);
  };

  const handleTextarea = (e) => {
    setDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        "courses/create",
        JSON.stringify({ title, description, price, level, deadline }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      await fileUpload(response?.data.id);
      setCourse(response?.data);
      alert(`${title} successfully created!`);
      setTitle("");
      setDescription("");
      setPrice(0);
      setLevel("");
      setDeadline("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Credentials");
      } else if (err.response?.status === 403) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Course Creation Failed");
      }
      errRef.current.focus();
    }
  };

  const fileUpload = async (id) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await axiosPrivate.patch(`courses/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        responseType: "arraybuffer" // Specify that the response should be treated as binary data
      });
    } catch (err) {
      setErrMsg("Document upload Failed");
      errRef.current.focus();
    }
  };

  return (
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='text-center'>New Course</h1>
        </div>

        <div className='p-3 pb-md-4 mx-auto row'>
          {/* Form for creating a new course */}
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            <div className='row g-3'>
              <div className='col-sm-8'>
                <div className='input-group mb-2'>
                  <input
                    type='text'
                    className='form-control bg-dark text-white'
                    placeholder='Course title'
                    aria-label='Course Title'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                  />
                </div>
              </div>

              <div className='col-sm-4'>
                <div className='input-group mb-2'>
                  <select
                    className='form-select bg-dark texy-white'
                    id='level'
                    value={level}
                    onChange={handleSelect}
                    required>
                    <option value=''>Choose Level</option>
                    <option value='BEGINNER'>Beginner</option>
                    <option value='INTERMEDIATE'>Intermediate</option>
                    <option value='ADVANCE'>Advance</option>
                  </select>
                </div>
              </div>

              <div className='input-group'>
                <textarea
                  className='form-control bg-dark texy-white'
                  aria-label='Description'
                  value={description}
                  onChange={handleTextarea}
                  placeholder='A short description about the course.'
                  required
                />
              </div>

              <div className='col-sm-3'>
                <div className='input-group mb-2'>
                  <span className='input-group-text bg-dark text-white'>
                    &#8358;
                  </span>
                  <input
                    type='number'
                    className='form-control bg-dark text-white'
                    aria-label='Price (to the nearest Naira)'
                    placeholder='Price'
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    required
                  />
                  <span className='input-group-text bg-dark text-white'>
                    .00
                  </span>
                </div>
              </div>

              <div className='col-sm-4'>
                <div className='input-group mb-2'>
                  <span
                    className='input-group-text bg-dark text-white'
                    id='deadline'>
                    Deadline
                  </span>
                  <input
                    type='date'
                    className='form-control bg-dark text-white'
                    id='deadline'
                    onChange={(e) => setDeadline(e.target.value)}
                    value={deadline}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className='col-sm-5'>
                <div className='input-group mb-2'>
                  <span
                    className='input-group-text bg-dark text-white'
                    id='file'>
                    Course Outline
                  </span>
                  <input
                    type='file'
                    className='form-control bg-dark text-white'
                    id='file'
                    onChange={handleFileChange}
                    required
                  />
                </div>
              </div>
              <div className='text-center'>
                <button className='btn bg-danger text-white btn-lg w-50'>
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

export default NewCourse;
