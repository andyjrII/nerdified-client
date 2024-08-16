import StudentInfo from '../../components/StudentInfo';
import ImageChange from '../../components/forms/ImageChange';
import PasswordChange from '../../components/forms/PasswordChange';
import '../../assets/styles/signin.css';

const Settings = () => {
  return (
    <section id='student-section' className='border-top border-bottom'>
      <main id='student-main' className='mx-3 mb-3 pb-2'>
        <StudentInfo />
        <div className='text-center my-3'>
          <p className='h1'>
            <span className='badge bg-danger'>Settings</span>
          </p>
        </div>
        <div className='row justify-content-center mt-4'>
          <div className='col-auto'>
            <ImageChange />
          </div>
          <div className='col-auto'>
            <PasswordChange />
          </div>
        </div>
      </main>
    </section>
  );
};

export default Settings;
