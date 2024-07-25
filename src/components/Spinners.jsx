import '../assets/styles/spinner.css';

const Spinners = () => {
  return (
    <div className='d-flex align-items-center my-auto'>
      <strong role='status'>Loading...</strong>
      <div className='spinner-border ms-auto' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
      <div className='spinner-grow ms-auto' role='status'>
        <span className='visually-hidden'>Loading...</span>
      </div>
    </div>
  );
};

export default Spinners;
