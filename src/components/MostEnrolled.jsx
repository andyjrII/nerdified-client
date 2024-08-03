import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';

const MostEnrolled = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getTopCourses = async () => {
      try {
        const response = await axiosPrivate.get('courses/top-enrolled/4', {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        setCourses(response?.data);
      } catch (error) {
        console.error('Error fetching Top Enrolled Courses');
      }
    };

    getTopCourses();
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

  const displayTopCourses = courses.map((course) => {
    return (
      <div className='col-md-3 p-2' key={course.id}>
        <div className='card text-bg-danger mb-3' style={{ maxWidth: '18rem' }}>
          <div className='card-header text-bg-danger'>
            Last Updated on{' '}
            <Moment format='MMMM D, YYYY'>{course.updatedAt}</Moment>
          </div>
          <div className='card-body'>
            <h5 className='card-title text-wrap'>{course.title}</h5>
            <p className='card-text text-white'>
              Price: &#8358;{course.price}.00
            </p>
            <button
              className='btn btn-lg btn-enrolled'
              onClick={() => getCourse(course.id)}
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
        <span className='badge bg-danger'>Top Courses</span>
      </h3>
      <div className='row p-3'>{displayTopCourses}</div>
    </>
  );
};

export default MostEnrolled;
