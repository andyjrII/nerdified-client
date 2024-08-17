import { useRef, useState, useEffect } from 'react';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import Swal from 'sweetalert2';

const NewPost = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const errRef = useRef();

  const [title, setTitle] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [title, datePosted, postUrl, selectedImage]);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
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
        'blog/create',
        JSON.stringify({ title, datePosted, postUrl }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      await imageUpload(response?.data.id);
      Swal.fire({
        icon: 'success',
        title: 'Post Created',
        text: `${title} created successfully`,
        confirmButtonText: 'OK',
      });
      setTitle('');
      setPostUrl('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Credentials');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Post Creation Failed');
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

  const imageUpload = async (id) => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    try {
      await axiosPrivate.patch(`blog/upload/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
    } catch (err) {
      setErrMsg('Image upload Failed');
      errRef.current.focus();
    }
  };

  return (
    <div className='container-fluid'>
      <div className='pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='text-center'>New Post</h1>
      </div>

      <div className='p-3 pb-md-4 mx-auto row'>
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'}>
          {errMsg}
        </p>

        <form onSubmit={handleSubmit}>
          <div className='row g-3'>
            <div className='col-md-7 mb-2'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control bg-dark text-white'
                  placeholder='Post title'
                  aria-label='Post Title'
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  required
                />
              </div>
            </div>

            <div className='col-md-5 mb-2'>
              <div className='input-group custom-file-input bg-dark mb-2'>
                <input
                  type='file'
                  className='file-upload bg-dark text-white'
                  id='file-upload'
                  onChange={handleImageChange}
                  accept='image/*'
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

            <div className='col-md-8 mb-2'>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control bg-dark text-white'
                  onChange={(e) => setPostUrl(e.target.value)}
                  value={postUrl}
                  required
                  placeholder='www.posturl.com'
                />
              </div>
            </div>

            <div className='col-md-4 mb-2'>
              <div className='input-group'>
                <span className='input-group-text bg-dark text-white'>
                  Date Published
                </span>
                <input
                  type='date'
                  className='form-control bg-dark text-white'
                  aria-label='Publication Date'
                  onChange={(e) => setDatePosted(e.target.value)}
                  value={datePosted}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className='text-center mt-3'>
              <button className='btn bg-danger text-white btn-lg w-50 p-2'>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
