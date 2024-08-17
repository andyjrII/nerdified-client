import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import axios from '../../api/axios';
import Swal from 'sweetalert2';

const UpdateCourse = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const navigate = useNavigate();

  const errRef = useRef();
  const courseId = localStorage.getItem('EDIT_COURSE_ID');
  const [title, setTitle] = useState(undefined);
  const [price, setPrice] = useState();
  const [course, setCourse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errMsg, setErrMsg] = useState();

  useEffect(() => {
    getCourse();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [title, price, courseId, selectedFile]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    try {
      setFileName(e.target.files[0].name);
    } catch (error) {
      console.log('No file selected');
    }
  };

  const getCourse = async () => {
    try {
      const response = await axios.get(`courses/course/${courseId}`);
      if (!response.data) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Course does not exist!',
          confirmButtonText: 'OK',
        });
      }
      setCourse(response?.data);
    } catch (err) {
      setErrMsg('Error Occured!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.patch(
        `courses/update/${courseId}`,
        JSON.stringify({ title, price }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (selectedFile) await fileUpload(response?.data.id);
      setCourse(response?.data);
      Swal.fire({
        icon: 'success',
        title: 'Update Success',
        text: `${course.title} updated successfully`,
        confirmButtonText: 'OK',
      });
      navigate(`/admin/courses`);
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Course with title already exists');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Update Failed');
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errMsg,
        confirmButtonText: 'OK',
      });
      errRef.current.focus();
    }
  };

  const fileUpload = async (id) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      await axiosPrivate.patch(`courses/upload/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
        responseType: 'arraybuffer', // Specify that the response should be treated as binary data
      });
    } catch (err) {
      setErrMsg('Document upload Failed');
      errRef.current.focus();
    }
  };

  return (
    <div className='container-fluid'>
      <div className='pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='text-center'>Update Course</h1>
      </div>

      <div className='p-3 pb-md-4 mx-auto row'>
        {/* Form for updating course */}
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'}>
          {errMsg}
        </p>
        <form onSubmit={handleSubmit}>
          <div className='row g-3'>
            <div className='col-md-12 mb-2'>
              <div className='input-group'>
                <span
                  className='input-group-text bg-dark text-white'
                  id='course-title'
                >
                  Title
                </span>
                <input
                  type='text'
                  className='form-control bg-dark text-white'
                  placeholder={course.title}
                  aria-label='Course Title'
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                />
              </div>
            </div>

            <div className='col-md-6 mb-2'>
              <div className='input-group'>
                <span className='input-group-text bg-dark text-white'>
                  &#8358;
                </span>
                <input
                  type='number'
                  className='form-control bg-dark text-white'
                  aria-label='Price (to the nearest Naira)'
                  placeholder={course.price}
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
                <span className='input-group-text bg-dark text-white'>.00</span>
              </div>
            </div>

            <div className='col-md-6 mb-2'>
              <div className='input-group custom-file-input bg-dark'>
                <input
                  type='file'
                  className='bg-dark text-white file-upload'
                  id='file-upload'
                  onChange={handleFileChange}
                />
                <span
                  htmlFor='file-upload'
                  className='bg-dark text-light custom-file-label'
                >
                  {fileName || 'Choose a file'}
                </span>
              </div>
            </div>

            <div className='text-center mt-3'>
              <button className='btn bg-danger text-white btn-lg p-2 w-50'>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
