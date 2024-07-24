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
        alert('Error fetching Latest Courses');
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
      alert('Error fetching Course');
    }
  };

  const displayLatestCourses = latestCourses.map((latestCourse) => {
    return (
      <div className='col-md-3 p-2' key={latestCourse.id}>
        <div className='card rounded-3'>
          <div className='card-body course-body rounded-3'>
            <div
              role='button'
              className='text-center text-white rounded p-3 mycourse-title'
              onClick={() => getCourse(latestCourse.id)}
            >
              <span className='bolded'>{latestCourse.title}</span>
              <br />
              Last Updated:{' '}
              <Moment format='MMMM D, YYYY'>{latestCourse.updatedAt}</Moment>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <h3 className='bolded mb-2'>Newest Courses</h3>
      <div className='row'>{displayLatestCourses}</div>
    </>
  );
};

export default NewestCourses;
