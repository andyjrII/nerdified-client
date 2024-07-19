import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/student.css';
import Navigation from '../components/navigation/Navigation';
import StudentSidebar from '../components/navigation/StudentSidebar';
import Footer from '../components/Footer';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';

const Student = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const email = localStorage.getItem('STUDENT_EMAIL');

  const [imagePath, setImagePath] = useState('');
  const [enrollmentDetails, setEnrollmentDetails] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axiosPrivate.get(`students/image/${email}`, {
          responseType: 'arraybuffer',
        });
        const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
        const imageUrl = URL.createObjectURL(imageBlob);
        setImagePath(imageUrl);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchImage();
  }, []);

  useEffect(() => {
    getEnrolledCourses();
    totalCourses();
  }, [totalCount]);

  const getEnrolledCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/enrolled/${email}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setEnrollmentDetails(response?.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCourse = async (id) => {
    try {
      const response = await axiosPrivate.get(`courses/course/${id}`, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      localStorage.setItem('NERDVILLE_COURSE', JSON.stringify(response?.data));
      navigate('/courses/course');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const totalCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/total/${email}`);
      setTotalCount(response?.data);
    } catch (error) {
      console.error('Error:', error);
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
              Starts{' '}
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
      <Navigation />
      <section className='row mb-0' id='student-section'>
        <aside className='col-md-1 student-left'>
          <StudentSidebar />
        </aside>
        <main className='col-md-11' id='student-main'>
          <div className='row'>
            <div className='col p-5'>
              <div className='card'>
                <div className='card-body row'>
                  <div className='col-md-10'>
                    <p className='card-text text-white'>Welcome Back!</p>
                    <h5 className='card-title text-white'>Your Dashboard</h5>
                    <p className='card-text text-white'>
                      "Education is the ability to listen to anything without
                      losing your temper or your self-confidence"
                    </p>
                  </div>
                  <div className='col-md-2'>
                    <img
                      src={imagePath}
                      id='student-img'
                      alt='Profile Picture'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row p-3 mx-2 shadow'>
            <h1 className='bolded pb-2'>
              My Courses <span className='total-courses'>({totalCount})</span>
            </h1>
            {displayMyCourses}
          </div>
        </main>
      </section>
      <Footer />
    </>
  );
};

export default Student;
