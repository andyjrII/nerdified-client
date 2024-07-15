import { useState, useEffect, useRef } from 'react';
import Navigation from '../components/navigation/Navigation';
import Footer from '../components/Footer';
import '../assets/styles/signin.css';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { PaystackButton } from 'react-paystack';
import { useNavigate } from 'react-router-dom';
import Missing from './Missing';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FcGlobe, FcCalendar, FcClock } from 'react-icons/fc';

const publicKey = 'pk_test_244916c0bd11624711bdab398418c05413687296';

const CourseEnrollment = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const errRef = useRef();

  const [selectedDays, setSelectedDays] = useState([]);

  const [selectedTime, setSelectedTime] = useState('MORNING');
  const [selectedMode, setSelectedMode] = useState('ONLINE');

  const [errMsg, setErrMsg] = useState('');

  const course = JSON.parse(localStorage.getItem('NERDVILLE_COURSE'));
  if (course) {
    var courseId = course.id;
    var amount = course.price;
    var courseTitle = course.title;
  }
  const email = localStorage.getItem('STUDENT_EMAIL');
  const reference = localStorage.getItem('PAYMENT_REFERENCE');

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

  const paymentsProps = {
    email,
    amount: parseFloat(amount * 100),
    metadata: {
      'Course Title': courseTitle,
    },
    publicKey,
    text: 'Pay Now',
    onSuccess: (response) => {
      const message =
        'Payment with Reference: ' +
        response.reference +
        ' complete! Thanks for doing business with us! Come back soon!!';
      localStorage.setItem(
        'PAYMENT_REFERENCE',
        JSON.stringify(response.reference)
      );
      savePaymentInfo();
      alert(message);
      navigate('/courses', { replace: true });
    },
    onClose: () => alert("Wait! You need this course, don't go!!!!"),
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
      console.error('Error:', error);
    }
  };

  return (
    <>
      {course ? (
        <>
          <Navigation />
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
                <div className='login-wrap py-4'>
                  <div
                    className='img d-flex align-items-center justify-content-center'
                    id='form-image'
                  ></div>
                  <h3 className='text-center mb-0'>Enroll for a Course</h3>
                  <p
                    ref={errRef}
                    className={`{errMsg ? "errmsg" : "offscreen"} text-center text-danger`}
                  >
                    {errMsg}
                  </p>

                  <form className='rounded shadow-lg'>
                    {/* Checkbox for Number of Sessions Per Week*/}
                    <div className='form-group'>
                      <div className='mb-2 text-white'>
                        <FcCalendar /> Number of Sessions Per Week
                      </div>
                      <div
                        className='btn-group'
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
                      <div className='mb-2 text-white'>
                        <FcClock /> Time of Day
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
                      <div className='mb-2 text-white'>
                        <FcGlobe /> Mode of Learning
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
                        Select your most preferred Mode of Learning
                      </p>
                    </div>

                    <div className='form-group w-100 py-3'>
                      <PaystackButton
                        type='button'
                        className='btn form-control btn-primary rounded px-3'
                        {...paymentsProps}
                        disabled={
                          !selectedDays || !selectedTime || !selectedMode
                            ? true
                            : false
                        }
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Missing />
      )}
      <Footer />
    </>
  );
};

export default CourseEnrollment;
