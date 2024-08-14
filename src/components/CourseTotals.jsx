import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import db from '../utils/localBase';

const CourseTotals = () => {
  const axiosPrivate = useAxiosPrivate();
  const [email, setEmail] = useState('');
  const [totalCourse, setTotalCourse] = useState(0);
  const [totalWishes, setTotalWishes] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchEmail(); // Fetch and set email
        if (email) {
          await getTotalCourses();
          await getTotalWishItems();
          await getPaidAmountTotals();
        }
      } catch (error) {
        console.log('Error during initialization:');
      }
    };

    initialize();
  }, [email]);

  const fetchEmail = async () => {
    const data = await db.collection('auth_student').get();
    setEmail(data[0].email);
  };

  const getTotalCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/total/${email}`);
      setTotalCourse(response?.data);
    } catch (error) {
      console.error('Error getting total number of Courses');
    }
  };

  const getTotalWishItems = async () => {
    try {
      const response = await axiosPrivate.get(`wishlist/total/${email}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setTotalWishes(response?.data);
    } catch (error) {
      console.error('Error getting total Wishlist items');
    }
  };

  const getPaidAmountTotals = async () => {
    try {
      const response = await axiosPrivate.get(`students/total-paid/${email}`);
      setTotalPaid(response?.data);
    } catch (error) {
      console.error('Error getting total amount paid for Courses');
    }
  };

  return (
    <div className='row mx-5 mb-4'>
      <div className='col-md-6 col-xl-4'>
        <div className='card widget-content bg-love-kiss'>
          <div className='widget-content-wrapper text-white'>
            <div className='widget-content-left'>
              <div className='widget-heading'>My Courses</div>
            </div>
            <div className='widget-content-right'>
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
            <div className='widget-content-left'>
              <div className='widget-heading'>My Wishlist</div>
            </div>
            <div className='widget-content-right'>
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
            <div className='widget-content-left'>
              <div className='widget-heading'>Spendings</div>
            </div>
            <div className='widget-content-right'>
              <div className='widget-numbers'>
                <span className='money'>{totalPaid}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseTotals;
