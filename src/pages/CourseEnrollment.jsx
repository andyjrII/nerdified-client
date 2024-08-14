import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/signin.css';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FcGlobe, FcCalendar } from 'react-icons/fc';
import { FaClock } from 'react-icons/fa';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { unformatCurrency } from '../utils/unformatCurrency';
import PaystackPop from '@paystack/inline-js';
import Missing from './Missing';
import db from '../utils/localBase';

const publicKey = 'pk_test_244916c0bd11624711bdab398418c05413687296';

const CourseEnrollment = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const errRef = useRef();

  const [selectedDays, setSelectedDays] = useState([]);

  const [selectedTime, setSelectedTime] = useState('MORNING');
  const [selectedMode, setSelectedMode] = useState('ONLINE');

  const [errMsg, setErrMsg] = useState('');

  const course = JSON.parse(localStorage.getItem('NERDVILLE_COURSE'));
  if (course) {
    var courseId = course.id;
    var amount = unformatCurrency(course.price);
    var courseTitle = course.title;
  }

  const reference = localStorage.getItem('PAYMENT_REFERENCE');

  useEffect(() => {
    const initializeData = async () => {
      try {
        const data = await db.collection('auth_student').get();
        if (data.length > 0) {
          setEmail(data[0].email);
        }
      } catch (error) {
        console.error('Error fetching email from localBase:', error);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [selectedDays]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    if (checked && selectedDays.length < 3) {
      setSelectedDays([...selectedDays, value]);
    } else if (!checked) {
      setSelectedDays(selectedDays.filter((item) => item !== value));
    } else {
      setErrMsg('Number of days should not be more than 3');
    }
  };

  const savePaymentInfo = async () => {
    try {
      await axiosPrivate.post(
        `students/enroll`,
        JSON.stringify({
          email,
          courseId,
          amount,
          reference,
          classDays: selectedDays,
          preferredTime: selectedTime,
          mode: selectedMode,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
    } catch (error) {
      alert('Error occurred');
    }
  };

  const handlePayment = async () => {
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: publicKey,
      email,
      amount: amount * 100,
      metadata: {
        'Course Title': courseTitle,
      },
      onSuccess: async (response) => {
        const message =
          courseTitle +
          ' payment complete! Thanks for enrolling with us! Check out our Other Courses!!';
        localStorage.setItem('PAYMENT_REFERENCE', response.reference);
        await savePaymentInfo();
        alert(message);
        navigate('/courses', { replace: true });
      },
      onClose: () => alert("Wait! You need this course, don't go!!!!"),
    });
  };

  return (
    <>
      {course ? (
        <main>
          <header className='py-3 bg-light border-bottom mb-4 header-bg'>
            <div className='container'>
              <div className='text-center my-3'>
                <p className='h1'>
                  <span className='badge bg-danger'>{courseTitle}</span>
                </p>
              </div>
            </div>
          </header>

          <div className='container mb-5 mt-2'>
            <div className='row justify-content-center'>
              <div className='col-md-6'>
                <div className='login-wrap py-4 shadow-lg'>
                  <div
                    className='img d-flex align-items-center justify-content-center'
                    id='form-image'
                  ></div>
                  <h3 className='text-center mb-0'>PAYMENT</h3>
                  <p
                    ref={errRef}
                    className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}
                  >
                    {errMsg}
                  </p>
                  s
                  <div className='form-group'>
                    {/* Checkbox for Number of Sessions Per Week*/}
                    <div className='mb-2 text-white d-flex'>
                      <FcCalendar className='align-self-center mr-2' /> Number
                      of Sessions Per Week
                    </div>
                    <div
                      className='btn-group'
                      id='enrol-check'
                      role='group'
                      aria-label='Days of the Week you will be available'
                    >
                      <input
                        type='checkbox'
                        className='btn-check'
                        id='monday'
                        autoComplete='off'
                        onChange={handleCheckboxChange}
                        checked={selectedDays.includes('MONDAY')}
                        value='MONDAY'
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='monday'
                      >
                        Monday
                      </label>
                      <input
                        type='checkbox'
                        className='btn-check'
                        id='tuesday'
                        autoComplete='off'
                        onChange={handleCheckboxChange}
                        checked={selectedDays.includes('TUESDAY')}
                        value='TUESDAY'
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='tuesday'
                      >
                        Tuesday
                      </label>
                      <input
                        type='checkbox'
                        className='btn-check'
                        id='wednesday'
                        autoComplete='off'
                        onChange={handleCheckboxChange}
                        checked={selectedDays.includes('WEDNESDAY')}
                        value='WEDNESDAY'
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='wednesday'
                      >
                        Wednesday
                      </label>
                      <input
                        type='checkbox'
                        className='btn-check'
                        id='thursday'
                        autoComplete='off'
                        onChange={handleCheckboxChange}
                        checked={selectedDays.includes('THURSDAY')}
                        value='THURSDAY'
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='thursday'
                      >
                        Thursday
                      </label>
                      <input
                        type='checkbox'
                        className='btn-check'
                        id='friday'
                        autoComplete='off'
                        onChange={handleCheckboxChange}
                        checked={selectedDays.includes('FRIDAY')}
                        value='FRIDAY'
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='friday'
                      >
                        Friday
                      </label>
                      <input
                        type='checkbox'
                        className='btn-check'
                        id='saturday'
                        autoComplete='off'
                        onChange={handleCheckboxChange}
                        checked={selectedDays.includes('SATURDAY')}
                        value='SATURDAY'
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='saturday'
                      >
                        Saturday
                      </label>
                    </div>
                    <p className='instructions'>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Select Maximum of 3 days
                    </p>
                  </div>
                  <hr className='bg-primary m-3' />
                  {/* Radio Button for Preferrable time of the day */}
                  <div className='form-group'>
                    <div className='mb-2 text-white d-flex'>
                      <FaClock className='align-self-center mr-2' /> Time of Day
                    </div>
                    <div
                      className='btn-group'
                      role='group'
                      aria-label='Select Time of the Day'
                    >
                      <input
                        type='radio'
                        className='btn-check'
                        id='morning'
                        name='time'
                        value='MORNING'
                        autoComplete='off'
                        checked={selectedTime === 'MORNING'}
                        onChange={() => setSelectedTime('MORNING')}
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='morning'
                      >
                        Morning
                      </label>
                      <input
                        type='radio'
                        className='btn-check'
                        id='afternoon'
                        name='time'
                        value='AFTERNOON'
                        autoComplete='off'
                        checked={selectedTime === 'AFTERNOON'}
                        onChange={() => setSelectedTime('AFTERNOON')}
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='afternoon'
                      >
                        Afternoon
                      </label>
                      <input
                        type='radio'
                        className='btn-check'
                        id='evening'
                        name='time'
                        value='EVENING'
                        autoComplete='off'
                        checked={selectedTime === 'EVENING'}
                        onChange={() => setSelectedTime('EVENING')}
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='evening'
                      >
                        Evening
                      </label>
                    </div>
                    <p className='instructions'>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Select time of the day you will be available for your
                      classes
                    </p>
                  </div>
                  <hr className='bg-primary m-3' />
                  {/* Radio button for Mode of learning */}
                  <div className='form-group mt-2'>
                    <div className='mb-2 text-white d-flex'>
                      <FcGlobe className='align-self-center mr-2' /> Mode of
                      Learning
                    </div>
                    <div
                      className='btn-group'
                      role='group'
                      aria-label='Select Time of the Day'
                    >
                      <input
                        type='radio'
                        className='btn-check'
                        id='online'
                        name='mode'
                        value='ONLINE'
                        autoComplete='off'
                        checked={selectedMode === 'ONLINE'}
                        onChange={() => setSelectedMode('ONLINE')}
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='online'
                      >
                        Online
                      </label>
                      <input
                        type='radio'
                        className='btn-check'
                        id='onsite'
                        name='mode'
                        value='ONSITE'
                        autoComplete='off'
                        checked={selectedMode === 'ONSITE'}
                        onChange={() => setSelectedMode('ONSITE')}
                      />
                      <label
                        className='btn btn-outline-primary'
                        htmlFor='onsite'
                      >
                        Onsite
                      </label>
                    </div>
                    <p className='instructions'>
                      <FontAwesomeIcon icon={faInfoCircle} />
                      Onsite venue is at Lokogoma, Abuja, Nigeria.
                    </p>
                  </div>
                  <div className='form-group w-100 py-3'>
                    <button
                      type='button'
                      className='btn form-control btn-primary rounded px-3'
                      onClick={handlePayment}
                      disabled={
                        !selectedDays.length || !selectedTime || !selectedMode
                      }
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <Missing />
      )}
    </>
  );
};

export default CourseEnrollment;
