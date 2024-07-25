import '../assets/styles/student.css';
import Navigation from '../components/navigation/Navigation';
import StudentSidebar from '../components/navigation/StudentSidebar';
import Footer from '../components/Footer';
import Welcome from '../components/Welcome';
import EnrolledCourses from '../components/EnrolledCourses';
import NewestCourses from '../components/NewestCourses';
import MostEnrolled from '../components/MostEnrolled';

const Student = () => {
  return (
    <>
      <Navigation />
      <section id='student-section' className='border-top border-bottom'>
        <main id='student-main' className='shadow'>
          <div className='row'>
            <div className='col p-5'>
              <Welcome />
            </div>
          </div>

          <div className='p-3 m-3 border rounded'>
            <EnrolledCourses />
          </div>

          <div className='p-3 m-3 border rounded'>
            <MostEnrolled />
          </div>

          <div className='p-3 m-3 border rounded'>
            <NewestCourses />
          </div>
        </main>
        <StudentSidebar />
      </section>
      <Footer />
    </>
  );
};

export default Student;
