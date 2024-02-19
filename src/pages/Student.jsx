import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/student.css";
import StudentLeftAside from "../components/navigation/StudentLeftAside";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Moment from "react-moment";
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

  const displayMyCourses = enrollmentDetails.map((enrollmentDetail) => {
    return (
      <div className="col-md-4 p-2" key={enrollmentDetail.id}>
        <div className="card">
          <div className="card-body course-body">
            <div
              role="button"
              className="text-center text-white rounded p-2 mycourse-title"
              onClick={() => getCourse(enrollmentDetail.courseId)}
            >
              <span className="bolded">{enrollmentDetail.course.title}</span>
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
        <div className="row pb-5">
          <h1 className="bolded">My Courses</h1>
          {displayMyCourses}
        </div>
        <div className="row pb-5">
          <h1 className="bolded">Other Courses</h1>
          {}
        </div>
      </main>
      <aside className="col-md-2">
        <StudentLeftAside />
      </aside>
    </section>
  );
};

export default Student;
