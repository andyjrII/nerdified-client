import { IoMail, IoCall } from 'react-icons/io5';
import { GrMap } from 'react-icons/gr';

const InfoModal = ({ email, phoneNumber, address }) => {
  return (
    <div
      className='modal fade'
      id='studentProfile'
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex='-1'
      aria-labelledby='studentProfileLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='studentProfileLabel'>
              My Profile
            </h1>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body text-center'>
            <p className='d-inline-flex gap-1 m-2'>
              <button
                className='btn btn-primary'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#email'
                aria-expanded='false'
                aria-controls='email'
              >
                <IoMail />
              </button>
              <button
                className='btn btn-primary'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#phoneNumber'
                aria-expanded='false'
                aria-controls='phoneNumber'
              >
                <IoCall />
              </button>
              <button
                className='btn btn-primary'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#address'
                aria-expanded='false'
                aria-controls='address'
              >
                <GrMap />
              </button>
            </p>
            <div className='row'>
              <div className='col'>
                <div className='collapse multi-collapse' id='email'>
                  <div className='card card-body'>Email: {email}</div>
                </div>
              </div>
              <div className='col'>
                <div className='collapse multi-collapse' id='phoneNumber'>
                  <div className='card card-body'>Phone: {phoneNumber}</div>
                </div>
              </div>
              <div className='col'>
                <div className='collapse multi-collapse' id='address'>
                  <div className='card card-body'>Address: {address}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn'
              id='btn-profile'
              data-bs-dismiss='modal'
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
