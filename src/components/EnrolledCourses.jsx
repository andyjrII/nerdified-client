import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import Moment from 'react-moment';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

const EnrolledCourses = ({ email }) => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [enrollmentDetails, setEnrollmentDetails] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Utility function to get the number of slides to show based on window width
  const getSlidesToShow = (width) => {
    if (width >= 1024) return 4;
    if (width >= 600) return 3;
    if (width >= 480) return 2;
    return 1;
  };

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    // Initial call to set the correct slidesToShow
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await axiosPrivate.get(`students/enrolled/${email}`, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        setEnrollmentDetails(response?.data);
      } catch (error) {
        console.error('Error fetching Courses');
      }
    };

    getEnrolledCourses();
  }, [axiosPrivate, email]);

  const separatedDays = (days) => {
    if (Array.isArray(days)) {
      days = days.join('');
    }
    const daysOfWeek = [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ];
    const regex = new RegExp(daysOfWeek.join('|'), 'g');
    const matchedDays = days.match(regex);
    if (matchedDays) {
      return matchedDays
        .map((day) => day.charAt(0) + day.slice(1).toLowerCase())
        .join(', ');
    }
    return '';
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
      console.error('Error fetching Course');
    }
  };

  const NextArrow = ({ onClick }) => {
    return (
      <div
        className={`custom-arrow custom-arrow-next ${
          currentSlide === enrollmentDetails.length - slidesToShow
            ? 'd-none'
            : ''
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
    infinite: false, // Disable infinite loop
    speed: 500,
    slidesToShow: slidesToShow,
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
          infinite: false, // Ensure infinite is false here
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false, // Ensure infinite is false here
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false, // Ensure infinite is false here
        },
      },
    ],
  };

  const displayMyCourses = enrollmentDetails.map((enrollmentDetail) => {
    return (
      <div className='col-md-12 p-2' key={enrollmentDetail.id}>
        <div className='card text-bg-primary' style={{ maxWidth: '18rem' }}>
          <div className='card-header text-bg-primary'>
            Enrolled on{' '}
            <Moment format='MMMM D, YYYY'>
              {enrollmentDetail.dateEnrolled}
            </Moment>
          </div>
          <div className='card-body'>
            <h5 className='card-title text-wrap'>
              {enrollmentDetail.course.title}
            </h5>
            <p className='card-text text-white day-text'>
              Class Days: [{separatedDays(enrollmentDetail.classDays)}]
            </p>
            <p className='card-text text-white day-text'>
              Time:{' '}
              {enrollmentDetail.preferredTime.charAt(0) +
                enrollmentDetail.preferredTime.slice(1).toLowerCase()}
            </p>
            <p className='card-text text-white day-text day-text'>
              Mode of Learning:{' '}
              {enrollmentDetail.mode.charAt(0) +
                enrollmentDetail.mode.slice(1).toLowerCase()}
            </p>
            <p className='card-text text-white day-text'>
              Class Status:{' '}
              {enrollmentDetail.status.charAt(0) +
                enrollmentDetail.status.slice(1).toLowerCase()}
            </p>
            <button
              className='btn btn-lg btn-enrolled'
              onClick={() => getCourse(enrollmentDetail.courseId)}
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
        <span className='badge bg-primary'>My Courses</span>
      </h3>
      <Slider {...settings} className='p-2'>
        {displayMyCourses}
      </Slider>
    </>
  );
};

export default EnrolledCourses;
