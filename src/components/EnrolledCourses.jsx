import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const EnrolledCourses = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const email = localStorage.getItem('STUDENT_EMAIL');

  const [enrollmentDetails, setEnrollmentDetails] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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
  }, [axiosPrivate, email]);

  const NextArrow = ({ onClick }) => {
    return (
      <div
        className={`custom-arrow custom-arrow-next ${
          currentSlide === enrollmentDetails.length - 4 ? 'd-none' : ''
        }`}
        onClick={onClick}
      >
        <FaAngleRight />
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div
        className={`custom-arrow custom-arrow-prev ${
          currentSlide === 0 ? 'd-none' : ''
        }`}
        onClick={onClick}
      >
        <FaAngleLeft />
      </div>
    );
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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

  const displayMyCourses = enrollmentDetails.map((enrollmentDetail) => {
    return (
      <div className='col-md-12 p-2' key={enrollmentDetail.id}>
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
      <Slider {...settings}>{displayMyCourses}</Slider>
    </>
  );
};

export default EnrolledCourses;
