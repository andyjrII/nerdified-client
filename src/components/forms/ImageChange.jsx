import { useState, useEffect } from 'react';
import '../../assets/styles/signin.css';
import { FcImageFile } from 'react-icons/fc';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import storage from '../../utils/storage';

const ImageChange = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [selectedImage]);

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${auth.email}`, {
        responseType: 'arraybuffer', // Set the response type to 'arraybuffer'
      });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' }); // Create a Blob from the binary data
      const imageUrl = URL.createObjectURL(imageBlob); // Create a temporary URL for the image
      setImagePath(imageUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedImage);
    try {
      await axiosPrivate.patch(`students/upload/${auth.email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      alert(`Image successfully updated!`);
      fetchImage();
      setSelectedImage(null);
    } catch (err) {
      alert('Error changing Profile Picture');
    }
  };

  return (
    <div className='student-wrap py-4'>
      <img src={imagePath} alt='Student' className='img-fluid' />
      <form className='login-form rounded' onSubmit={handleImageSubmit}>
        <div className='form-group'>
          <div className='icon d-flex align-items-center justify-content-center'>
            <span>
              <FcImageFile />
            </span>
          </div>
          <input
            type='file'
            className='form-control'
            accept='image/*'
            onChange={handleImageChange}
            required
          />
        </div>
        <div className='mt-2'>
          <button className='btn btn-primary rounded w-100'>
            Submit Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageChange;
