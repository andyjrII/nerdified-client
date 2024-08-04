import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import storage from '../utils/storage';

const CourseTotal = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth, setAuth } = useAuth();

  const [totalCourse, setTotalCourse] = useState(0);
  const [totalWishes, setTotalWishes] = useState(0);

  useEffect(() => {
    const storedAuth = storage.getData('auth');
    if (storedAuth) {
      setAuth(storedAuth);
    }

    getTotalCourses();
    getTotalWishItems();
  }, []);

  const getTotalCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/total/${auth.email}`);
      setTotalCourse(response?.data);
    } catch (error) {
      console.error('Error getting total number of Courses');
    }
  };

  const getTotalWishItems = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/total/${auth.email}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setTotalWishes(response?.data);
    } catch (error) {
      console.error('Error getting total Wishlist items');
    }
  };

  return (
    <div className='row px-5 mx-4 mb-5'>
      <div className='col-md-6 col-xl-4'>
        <div className='card widget-content bg-love-kiss'>
          <div className='widget-content-wrapper text-white'>
            <div className='widget-content-left mr-4'>
              <div className='widget-heading'>My Courses</div>
            </div>
            <div className='widget-content-right ml-4'>
              <div className='widget-numbers'>
                <span>{totalCourse}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-6 col-xl-4'>
        <div className='card widget-content bg-ripe-malin'>
          <div className='widget-content-wrapper text-white'>
            <div className='widget-content-left mr-4'>
              <div className='widget-heading'>My Wishlist</div>
            </div>
            <div className='widget-content-right ml-4'>
              <div className='widget-numbers'>
                <span>{totalWishes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-6 col-xl-4'>
        <div className='card widget-content bg-mean-fruit'>
          <div className='widget-content-wrapper text-white'>
            <div className='widget-content-left mr-4'>
              <div className='widget-heading'>My Spending</div>
            </div>
            <div className='widget-content-right ml-4'>
              <div className='widget-numbers'>
                <span>
                  <span>&#8358;</span>
                  656
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTotal;
