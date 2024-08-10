import MissingBg from '../assets/images/bg/missing-bg.png';
import '../assets/styles/navpages.css';

const Missing = () => {
  return (
    <main>
      <header className='py-3 bg-light border-bottom mb-4 header-bg'>
        <div className='container'>
          <div className='text-center my-3'>
            <p className='h1'>
              <span className='badge bg-danger'>Missing Page</span>
            </p>
          </div>
        </div>
      </header>
      <section className='text-center container section-missing'>
        <img src={MissingBg} alt='Error 404' height='368px' width='800px' />
      </section>
    </main>
  );
};

export default Missing;
