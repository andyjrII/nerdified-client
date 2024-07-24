import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';

const EnrolledCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const email = localStorage.getItem('STUDENT_EMAIL');

  const [enrollmentDetails, setEnrollmentDetails] = useState([]);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await axiosPrivate.get(`students/enrolled/${email}`, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        setEnrollmentDetails(response?.data);
      } catch (error) {
        alert('Error fetching Courses');
      }
    };

    getEnrolledCourses();
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
      alert('Error fetching Course');
    }
  };

  const displayMyCourses = enrollmentDetails.map((enrollmentDetail) => {
    return (
      <div className='col-md-3 p-2' key={enrollmentDetail.id}>
        <div className='card rounded-3'>
          <div className='card-body course-body rounded-3'>
            <div
              role='button'
              className='text-center text-white rounded p-3 mycourse-title'
              onClick={() => getCourse(enrollmentDetail.courseId)}
            >
              <span className='bolded'>{enrollmentDetail.course.title}</span>
              <br />
              Last Updated:{' '}
              <Moment format='MMMM D, YYYY'>
                {enrollmentDetail.course.updatedAt}
              </Moment>
            </div>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <h3 className='bolded mb-2'>My Courses</h3>
      {displayMyCourses}
    </>
  );
};

export default EnrolledCourses;
