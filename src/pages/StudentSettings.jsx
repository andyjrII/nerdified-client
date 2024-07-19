import '../assets/styles/student.css';
import StudentSidebar from '../components/navigation/StudentSidebar';
import PasswordChange from '../components/forms/PasswordChange';
import ImageChange from '../components/forms/ImageChange';

const StudentSettings = () => {
  return (
    <section className='row mb-0'>
      <aside className='col-md-1 bg-light'>
        <StudentSidebar />
      </aside>
      <main className='col-md-10'>
        <div className='container py-5'>
          <div className='row justify-content-center'>
            <div className='col-lg-4 mb-5 mr-3'>
              <PasswordChange />
            </div>
            <div className='col-lg-4'>
              <ImageChange />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default StudentSettings;
