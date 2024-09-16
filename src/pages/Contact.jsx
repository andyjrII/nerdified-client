import '../assets/styles/navpages.css';

const Contact = () => {
  return (
    <main>
      <header className='py-3 bg-light border-bottom mb-4 header-bg'>
        <div className='container'>
          <div className='text-center my-3'>
            <p className='h1'>
              <span className='badge bg-danger'>Contact Us</span>
            </p>
          </div>
        </div>
      </header>
      {/* Page content */}
      <div className='container py-3 my-3'>
        <div className='row'>
          {/* Google Map */}
          <div className='col-lg-6'>
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31527.424278968356!2d7.420422434806822!3d8.978769751982583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0d743d4a46ad%3A0x5b3e93efbcfdbf4e!2sEfab%20Estate%2C%20Lokogoma!5e0!3m2!1sen!2sng!4v1726504313406!5m2!1sen!2sng'
              className='address-map'
              title='Nerdified Africa Address'
              loading='lazy'
              referrerpolicy='no-referrer-when-downgrade'
            ></iframe>
          </div>

          {/* Contact form */}
          <div className='col-lg-6 text-center'>
            <h3>Mail us</h3>
            <form
              action='mailto:nerdified.get@gmail.com'
              method='post'
              enctype='text/plain'
              className='needs-validation'
              novalidate
            >
              <div className='row mb-2'>
                <div className='col-lg-12 input-group mb-2'>
                  <input
                    type='text'
                    className='form-control rounded'
                    name='name'
                    placeholder='Name'
                    required
                  />
                </div>

                <div className='col-md-6 input-group mb-2'>
                  <input
                    type='email'
                    className='form-control rounded'
                    name='email'
                    placeholder='Email'
                    required
                  />
                </div>

                <div className='col-md-6 input-group mb-2'>
                  <input
                    type='tel'
                    className='form-control rounded'
                    name='phone-number'
                    placeholder='+234900000000'
                    required
                  />
                </div>

                <div className='col-lg-12 input-group mb-1'>
                  <input
                    type='text'
                    className='form-control rounded'
                    name='subject'
                    placeholder='Subject'
                    required
                  />
                </div>
              </div>

              <div className='row'>
                <div className='input-group mb-3'>
                  <textarea
                    className='form-control rounded'
                    name='message'
                    cols='10'
                    placeholder='Message'
                    required
                  ></textarea>
                </div>
              </div>
              <div className='row'>
                <button
                  type='submit'
                  id='check-btn'
                  className='btn btn-lg mx-auto w-50'
                >
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
