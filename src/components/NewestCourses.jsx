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
      navigate('/courses/course');
    } catch (error) {
      console.error('Error fetching Course');
    }
  };

  const displayLatestCourses = latestCourses.map((latestCourse) => {
    return (
      <div className='col-md-3 p-2' key={latestCourse.id}>
        <div className='card text-bg-warning' style={{ maxWidth: '18rem' }}>
          <div className='card-header text-bg-warning text-white'>
            Last Updated on{' '}
            <Moment format='MMMM D, YYYY'>{latestCourse.updatedAt}</Moment>
          </div>
          <div className='card-body'>
            <h5 className='card-title text-wrap text-white'>
              {latestCourse.title}
            </h5>
            <p className='card-text text-white'>Price: {latestCourse.price}</p>
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
      <h3 className='bolded px-3'>
        <span className='badge bg-warning'>Latest Courses</span>
      </h3>
      <div className='row px-3 py-2'>{displayLatestCourses}</div>
    </>
  );
};

export default NewestCourses;
