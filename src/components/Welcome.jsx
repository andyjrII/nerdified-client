import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const Welcome = () => {
  const axiosPrivate = useAxiosPrivate();

  const email = localStorage.getItem('STUDENT_EMAIL');

  const [imagePath, setImagePath] = useState('');

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: 'arraybuffer',
      });
      const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setImagePath(imageUrl);
    } catch (error) {
      alert('Error getting profile image');
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <div className='card'>
      <div className='card-body row'>
        <div className='col-md-10'>
          <p className='card-text text-white'>Welcome Back!</p>
          <h5 className='card-title text-white'>Your Dashboard</h5>
          <p className='card-text text-white'>
            'Education is the ability to listen to anything without losing your
            temper or your self-confidence'
          </p>
        </div>
        <div className='col-md-2'>
          <img src={imagePath} id='student-img' alt='Profile' />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
