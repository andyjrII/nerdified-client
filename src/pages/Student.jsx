import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/student.css";
import StudentLeftAside from "../components/navigation/StudentLeftAside";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Moment from "react-moment";
import { FaHandPointRight } from "react-icons/fa";
import Logo from "../assets/images/logo.png";

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
          withCredentials: true,
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
      <tr key={enrollmentDetail.id} className="bg-danger text-white">
        <td className="bg-black">
          <FaHandPointRight
            role="button"
            tabIndex="0"
            onClick={() => getCourse(enrollmentDetail.courseId)}
          />
        </td>
        <td>{enrollmentDetail.course.title}</td>
        <td>{enrollmentDetail.course.level}</td>
        <td>&#8358;{enrollmentDetail.paidAmount}</td>
        <td>
          <Moment format="MMMM D, YYYY">{enrollmentDetail.dateEnrolled}</Moment>
        </td>
        <td>{enrollmentDetail.reference}</td>
        <td>
          <Moment format="MMMM D, YYYY">
            {enrollmentDetail.course.deadline}
          </Moment>
        </td>
        <td>{enrollmentDetail.status}</td>
      </tr>
    );
  });

  const displayMyCourses = enrollmentDetails.map((enrollmentDetail) => {
    return (
      <div class="col-md-4 p-2" key={enrollmentDetail.id}>
        <div class="card">
          <div class="card-body">
            <div
              role="button"
              class="bg-danger text-center text-white rounded p-2 mycourse-title"
              onClick={() => getCourse(enrollmentDetail.courseId)}
            >
              {enrollmentDetail.course.title}
              <br />
              Starts{" "}
              <Moment format="MMMM D, YYYY">
                {enrollmentDetail.course.deadline}
              </Moment>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const getCourse = async (id) => {
    try {
      const response = await axiosPrivate.get(`courses/course/${id}`, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      localStorage.setItem("NERDVILLE_COURSE", JSON.stringify(response?.data));
      navigate("/courses/course");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="row mb-0">
      <aside className="col-md-2">
        <StudentLeftAside />
      </aside>
      <main className="col-md-8">
        <div className="row">
          <div className="col p-5">
            <div className="card bg-danger">
              <div className="card-body row">
                <div className="col-md-10">
                  <p className="card-text text-white">Welcome Back!</p>
                  <h5 className="card-title text-white">Your Dashboard</h5>
                  <p className="card-text text-white">
                    "Education is the ability to listen to anything without
                    losing your temper or your self-confidence"
                  </p>
                </div>
                <div className="col-md-2">
                  <img
                    src={Logo}
                    width="100%"
                    height="100%"
                    alt="<Nerdified />"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Enrolled Courses */}
        <div className="row pb-5">{displayMyCourses}</div>
        {/*
        <div className="container pt-4">
          <p className="h1 pb-3 text-center">
            <span className="badge bg-dark">Course Enrollment History</span>
          </p>
          <table className="table">
            <thead>
              <tr className="bg-black text-white">
                <th scope="col"></th>
                <th scope="col">Course</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Amount</th>
                <th scope="col">Date Paid</th>
                <th scope="col">Reference</th>
                <th scope="col">Start Date</th>
                <th scope="col">Course Status</th>
              </tr>
            </thead>
            <tbody>{displayEnrollments}</tbody>
          </table>
        </div>
      */}
      </main>
      <aside className="col-md-2">
        <StudentLeftAside />
      </aside>
    </section>
  );
};

export default Student;
