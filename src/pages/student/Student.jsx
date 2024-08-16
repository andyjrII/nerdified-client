import '../../assets/styles/student.css';
import EnrolledCourses from '../../components/EnrolledCourses';
import NewestCourses from '../../components/NewestCourses';
import MostEnrolled from '../../components/MostEnrolled';
import CourseTotals from '../../components/CourseTotals';
import StudentInfo from '../../components/StudentInfo';

const Student = () => {
  return (
    <section id='student-section' className='border-top border-bottom'>
      <main id='student-main' className='mx-3 mb-3 pb-2'>
        <StudentInfo />

        <CourseTotals />

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
    </section>
  );
};

export default Student;
