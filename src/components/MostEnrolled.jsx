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
        alert('Error fetching Top Enrolled Courses');
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
      alert('Error fetching Course');
    }
  };

  const displayTopCourses = courses.map((course) => {
    return (
      <div className='col-md-3 p-2' key={course.id}>
        <div className='card rounded-3'>
          <div className='card-body course-body rounded-3'>
            <div
              role='button'
              className='text-center text-white rounded p-3 mycourse-title'
              onClick={() => getCourse(course.id)}
            >
              <span className='bolded'>{course.title}</span>
              <br />
              Last Updated:{' '}
              <Moment format='MMMM D, YYYY'>{course.updatedAt}</Moment>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <h3 className='bolded mb-2'>Top Courses</h3>
      <div className='row'>{displayTopCourses}</div>
    </>
  );
};

export default MostEnrolled;
