import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';

const NewestCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [latestCourses, setLatestCourses] = useState([]);

  useEffect(() => {
    const getLatestCourses = async () => {
      try {
        const response = await axiosPrivate.get('courses/latest/4', {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        setLatestCourses(response?.data);
      } catch (error) {
        console.error('Error fetching Latest Courses');
      }
    };

    getLatestCourses();
  }, []);

  const getCourse = async (id) => {
    try {
      const response = await axiosPrivate.get(`courses/course/${id}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      localStorage.setItem('NERDVILLE_COURSE', JSON.stringify(response?.data));
      navigate('/course-details');
    } catch (error) {
      console.error('Error fetching Course');
    }
  };

  const displayLatestCourses = latestCourses.map((latestCourse) => {
    return (
      <div className='col-md-3 p-2' key={latestCourse.id}>
        <div
          className='card text-bg-warning mb-3'
          style={{ maxWidth: '18rem' }}
        >
          <div className='card-header text-bg-warning text-white'>
            Last Updated on{' '}
            <Moment format='MMMM D, YYYY'>{latestCourse.updatedAt}</Moment>
          </div>
          <div className='card-body'>
            <h5 className='card-title text-wrap text-white'>
              {latestCourse.title}
            </h5>
            <p className='card-text text-white'>
              Price: &#8358;{latestCourse.price}.00
            </p>
            <button
              className='btn btn-lg btn-enrolled'
              onClick={() => getCourse(latestCourse.id)}
            >
              View
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <h3 className='bolded'>
        <span className='badge bg-warning'>Latest Courses</span>
      </h3>
      <div className='row p-3'>{displayLatestCourses}</div>
    </>
  );
};

export default NewestCourses;
