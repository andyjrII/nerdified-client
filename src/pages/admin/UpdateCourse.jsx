import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import axios from '../../api/axios';
import Swal from 'sweetalert2';
import { SyncLoader } from 'react-spinners';

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

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState();

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      if (title) formData.append('title', title);
      if (price) formData.append('price', price);
      if (selectedFile) formData.append('pdf', selectedFile);
      const response = await axiosPrivate.patch(
        `courses/update/${courseId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
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
        setErrMsg('Bad request.');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Update Failed');
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errMsg || 'Update Failed!',
        confirmButtonText: 'OK',
      });
      errRef.current.focus();
    }
    setLoading(false);
  };

  // Function to extract the file name with extension
  const getFileNameFromUrl = (url) => {
    if (!url) return ''; // Check if url is undefined or null
    const segments = url.split('/');
    return segments.pop(); // Return the last segment of the URL
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

            <div className='col-md-4 mb-2'>
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
              </div>
            </div>

            <div className='col-md-8 mb-2'>
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
              <small>
                <b>Current File: </b>
                {course.details
                  ? getFileNameFromUrl(course.details)
                  : 'No file available'}
              </small>
            </div>

            <div className='text-center mt-3'>
              <button className='btn bg-danger text-white btn-lg w-25'>
                {loading ? (
                  <SyncLoader
                    size={20}
                    color='#ffffff'
                    style={{
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourse;
