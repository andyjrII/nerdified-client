import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/student.css";
import StudentSidebar from "../components/navigation/StudentSidebar";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Moment from "react-moment";
import { FaHandPointRight } from "react-icons/fa";

const Student = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const email = localStorage.getItem("STUDENT_EMAIL");

  const [enrollmentDetails, setEnrollmentDetails] = useState([]);

  useEffect(() => {
    const getEnrolledCourses = async () => {
      try {
        const response = await axiosPrivate.get(`students/enrolled/${email}`, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        });
        setEnrollmentDetails(response?.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getEnrolledCourses();
  }, []);

  const displayEnrollments = enrollmentDetails.map((enrollmentDetail) => {
    return (
      <tr key={enrollmentDetail.id} className='bg-danger text-white'>
        <td className='bg-black'>
          <FaHandPointRight
            role='button'
            tabIndex='0'
            onClick={() => getCourse(enrollmentDetail.courseId)}
          />
        </td>
        <td>{enrollmentDetail.course.title}</td>
        <td>{enrollmentDetail.course.level}</td>
        <td>&#8358;{enrollmentDetail.paidAmount}</td>
        <td>
          <Moment format='MMMM D, YYYY'>{enrollmentDetail.dateEnrolled}</Moment>
        </td>
        <td>{enrollmentDetail.reference}</td>
        <td>
          <Moment format='MMMM D, YYYY'>
            {enrollmentDetail.course.deadline}
          </Moment>
        </td>
        <td>{enrollmentDetail.status}</td>
      </tr>
    );
  });

  const getCourse = async (id) => {
    try {
      const response = await axiosPrivate.get(`courses/course/${id}`, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      localStorage.setItem("NERDVILLE_COURSE", JSON.stringify(response?.data));
      navigate("/courses/course");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className='body row mb-0'>
      <StudentSidebar />
      <main className='col-md-10'>
        <nav className='navbar'>
          <div className='container-fluid'>
            <Link role='button' to='/student/password' id='password-btn'>
              Change Password
            </Link>
          </div>
        </nav>
        <div className='container pt-4'>
          <p className='h1 pb-3 text-center'>
            <span className='badge bg-dark'>Course Enrollment History</span>
          </p>
          {/* Course Enrollment History Table */}
          <table className='table'>
            <thead>
              <tr className='bg-black text-white'>
                <th scope='col'></th>
                <th scope='col'>Course</th>
                <th scope='col'>Difficulty</th>
                <th scope='col'>Amount</th>
                <th scope='col'>Date Paid</th>
                <th scope='col'>Reference</th>
                <th scope='col'>Start Date</th>
                <th scope='col'>Course Status</th>
              </tr>
            </thead>
            {/* Display Courses Enrolled for */}
            <tbody>{displayEnrollments}</tbody>
          </table>
        </div>
      </main>
    </section>
  );
};

export default Student;
