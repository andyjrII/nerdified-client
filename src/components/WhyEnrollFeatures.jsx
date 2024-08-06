import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGlobe,
  faSuitcase,
  faClock,
  faLaptop,
} from '@fortawesome/free-solid-svg-icons';

const WhyEnrollFeatures = () => {
  return (
    <div className='row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-4'>
      <div className='col-md-3'>
        <div
          className='card card-cover h-100 overflow-hidden rounded-4 shadow-lg'
          id='why-enroll-1'
        >
          <div className='overlay'>
            <div className='d-flex flex-column h-100 p-3 pb-3 text-white'>
              <p className='pt-5 my-4 lh-1 why-enroll-text'>
                Whether you prefer in-person learning or flexibility of online
                classes, we have you covered. Our on-site classes offer a
                collaborative environment, while our online classes esure that
                distance is never a barrier to gaining quality education.
              </p>
              <ul className='d-flex list-unstyled mt-auto'>
                <li className='d-flex align-items-center align-content-center mx-auto'>
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className='me-2'
                    width='1em'
                    height='1em'
                  />
                  <small>On-site & Online Classes</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='col-md-3'>
        <div
          className='card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg'
          id='why-enroll-2'
        >
          <div className='overlay'>
            <div className='d-flex flex-column h-100 p-3 pb-3 text-white'>
              <p className='pt-5 my-4 lh-1 why-enroll-text'>
                After completing your coursework, we provide an intership
                program that allows you to apply what you've learned in
                real-world scenarios. This hands-on experience is invaluable for
                building your resume & gaining practical skills that employers
                seek.
              </p>
              <ul className='d-flex list-unstyled mt-auto'>
                <li className='d-flex align-items-center align-content-center mx-auto'>
                  <FontAwesomeIcon
                    icon={faSuitcase}
                    className='me-2'
                    width='1em'
                    height='1em'
                  />
                  <small>Internship Opportunities</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='col-md-3'>
        <div
          className='card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg'
          id='why-enroll-3'
        >
          <div className='overlay'>
            <div className='d-flex flex-column h-100 p-3 pb-3 text-shadow-1'>
              <p className='pt-5 my-4 lh-1 why-enroll-text'>
                We understand that everyone has different schedules &
                commitments. That's why we offer flexible learning options that
                allow you to choose your preferred class times and the number of
                sessions per week. Learn at your own pace & on your own terms.
              </p>
              <ul className='d-flex list-unstyled mt-auto'>
                <li className='d-flex align-items-center align-content-center mx-auto'>
                  <FontAwesomeIcon
                    icon={faClock}
                    className='me-2'
                    width='1em'
                    height='1em'
                  />
                  <small>Flexible Learning Schedule</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='col-md-3'>
        <div
          className='card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg'
          id='why-enroll-4'
        >
          <div className='overlay'>
            <div className='d-flex flex-column h-100 p-3 pb-3 text-white'>
              <p className='pt-5 my-4 lh-1 why-enroll-text'>
                Our curriculum is designed around real-world projects to ensure
                that you not only learn theoretical concepts but also apply them
                in practical situations. By working on actual projects, you'll
                gain the confidence & skills needed to tackle real-world
                challenges.
              </p>
              <ul className='d-flex list-unstyled mt-auto'>
                <li className='d-flex align-items-center align-content-center mx-auto'>
                  <FontAwesomeIcon
                    icon={faLaptop}
                    className='me-2'
                    width='1em'
                    height='1em'
                  />
                  <small>Real-World Projects</small>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyEnrollFeatures;
