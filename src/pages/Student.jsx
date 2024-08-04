import '../assets/styles/student.css';
import Navigation from '../components/navigation/Navigation';
import StudentSidebar from '../components/navigation/StudentSidebar';
import Footer from '../components/Footer';
import Welcome from '../components/Welcome';
import EnrolledCourses from '../components/EnrolledCourses';
import NewestCourses from '../components/NewestCourses';
import MostEnrolled from '../components/MostEnrolled';
import CourseTotal from '../components/CourseTotal';

const Student = () => {
  return (
    <>
      <Navigation />
      <section id='student-section' className='border-top border-bottom'>
        <main id='student-main' className='mx-3 mb-3 pb-2'>
          <div className='row'>
            <div className='col p-5 mx-5'>
              <Welcome />
            </div>
          </div>

          <CourseTotal />

          <div className='p-3 m-3 shadow rounded'>
            <EnrolledCourses />
          </div>

          <div className='p-3 m-3 shadow rounded'>
            <MostEnrolled />
          </div>

          <div className='p-3 m-3 shadow rounded'>
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
