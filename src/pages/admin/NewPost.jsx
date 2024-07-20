import AdminSidebar from '../../components/navigation/AdminSidebar';
import { useRef, useState, useEffect } from 'react';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import '../../assets/styles/admin.css';

const NewPost = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const errRef = useRef();

  const [post, setPost] = useState('');
  const [title, setTitle] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    setErrMsg('');
  }, [title, datePosted, postUrl, selectedImage]);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
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
      setPost(response?.data);
      alert(`${title} with URL ${postUrl} successfully created!`);
      setTitle('');
      setPostUrl('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Credentials');
      } else if (err.response?.status === 403) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Post Creation Failed');
      }
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
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='text-center'>New Post</h1>
        </div>

        <div className='p-3 pb-md-4 mx-auto row'>
          {/* Form for creating a new post */}
          <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'}>
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            <div className='row g-3'>
              <div className='col-sm-4'>
                <div className='input-group mb-3'>
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

              <div className='col-sm-4'>
                <div className='input-group mb-3'>
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

              <div className='col-sm-4'>
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control bg-dark text-white'
                    onChange={(e) => setPostUrl(e.target.value)}
                    value={postUrl}
                    required
                    placeholder='Post URL'
                  />
                </div>
              </div>

              <div className='col-sm-4'>
                <div className='input-group mb-3'>
                  <span
                    className='input-group-text bg-dark text-white'
                    id='image'
                  >
                    Post Image
                  </span>
                  <input
                    type='file'
                    className='form-control bg-dark text-white'
                    id='image'
                    accept='image/*'
                    onChange={handleImageChange}
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

export default NewPost;
