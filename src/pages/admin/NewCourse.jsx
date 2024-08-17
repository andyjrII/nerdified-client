import { useRef, useState, useEffect } from 'react';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import Swal from 'sweetalert2';

const NewCourse = () => {
  const errRef = useRef();

  const axiosPrivate = useAdminAxiosPrivate();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [title, price, selectedFile]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    try {
      setFileName(e.target.files[0].name);
    } catch (error) {
      console.log('No file selected');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        'courses/create',
        JSON.stringify({ title, price }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      await fileUpload(response?.data.id);
      Swal.fire({
        icon: 'success',
        title: 'Course Created',
        text: `${title} created successfully`,
        confirmButtonText: 'OK',
      });
      setTitle('');
      setPrice(0);
    } catch (err) {
      if (err.response?.status === 400) {
        setErrMsg('Course with title already exists!');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errMsg || 'Creation Failed!',
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
        responseType: 'arraybuffer',
      });
    } catch (err) {
      setErrMsg('Document upload Failed');
      errRef.current.focus();
    }
  };

  return (
    <div className='container-fluid'>
      <div className='pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='text-center'>New Course</h1>
      </div>

      <div className='p-3 pb-md-4 mx-auto row'>
        {/* Form for creating a new course */}
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'}>
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
                <span className='input-group-text bg-dark text-white'>.00</span>
              </div>
            </div>

            <div className='col-sm-11'>
              <div className='input-group custom-file-input bg-dark mb-2'>
                <input
                  type='file'
                  className='file-upload bg-dark text-white'
                  id='file-upload'
                  onChange={handleFileChange}
                  required
                />
                <span
                  htmlFor='file-upload'
                  className='bg-dark text-light custom-file-label'
                >
                  {fileName || 'Choose a file'}
                </span>
              </div>
            </div>
            <div className='text-center'>
              <button className='btn bg-danger text-white btn-lg w-25'>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCourse;
