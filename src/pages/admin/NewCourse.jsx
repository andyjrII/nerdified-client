import { useRef, useState, useEffect } from 'react';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import Swal from 'sweetalert2';
import { SyncLoader } from 'react-spinners';

const NewCourse = () => {
  const errRef = useRef();

  const axiosPrivate = useAdminAxiosPrivate();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('pdf', selectedFile);
      await axiosPrivate.post('courses/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      Swal.fire({
        icon: 'success',
        title: 'Course Created',
        text: `${title} created successfully`,
        confirmButtonText: 'OK',
      });
      setTitle('');
      setPrice(0);
      setSelectedFile(null);
      setFileName('');
    } catch (err) {
      if (err.response?.status === 400) {
        setErrMsg('Check file & reupload.');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else if (err.response?.status === 409) {
        setErrMsg('Course with title already exists!');
      }
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errMsg || 'Creation Failed!',
        confirmButtonText: 'OK',
      });
      errRef.current.focus();
    }
    setLoading(false);
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCourse;
