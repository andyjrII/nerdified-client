import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/student.css";
import StudentRightAside from "../components/navigation/StudentRightAside";
import StudentNavItems from "../components/navigation/StudentNavItems";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Moment from "react-moment";
import Logo from "../assets/images/logo.png";

const Student = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const email = localStorage.getItem("STUDENT_EMAIL");

  const [enrollmentDetails, setEnrollmentDetails] = useState([]);
  const [latestCourses, setLatestCourses] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    getEnrolledCourses();
    getLatestCourses();
    totalCourses();
  }, []);

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

  const getLatestCourses = async () => {
    try {
      const response = await axiosPrivate.get("courses/latest/6", {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setLatestCourses(response?.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  const totalCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/total/${email}`);
      setTotalCount(response?.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const displayMyCourses = enrollmentDetails.map((enrollmentDetail) => {
    return (
      <div className="col-md-3 p-2" key={enrollmentDetail.id}>
        <div className="card rounded-3">
          <div className="card-body course-body rounded-3">
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

  const displayLatestCourses = latestCourses.map((latestCourse) => {
    return (
      <div className="col-md-2 p-1" key={latestCourse.id}>
        <div className="card latest_course rounded-2">
          <div
            className="card-body rounded-2"
            role="button"
            onClick={() => getCourse(latestCourse.id)}
          >
            <span className="bolded">{latestCourse.title}</span>
          </div>
        </div>
      </div>
    );
  });

  return (
    <section className="row mb-0">
      <aside className="col-md-1 bg-light">
        <StudentNavItems />
      </aside>
      <main className="col-md-9">
        <div className="row">
          <div className="col p-5">
            <div className="card">
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
        <div className="row p-3 mx-2 shadow">
          <h1 className="bolded pb-2">
            My Courses <span className="total-courses">({totalCount})</span>
          </h1>
          {displayMyCourses}
        </div>
        {/* Other Courses */}
        <div className="row p-3 mx-2 my-5 shadow">
          <h1 className="bolded pb-2">
            Other Courses
            <Link to="/courses" className="btn btn-lg view-courses">
              View All
            </Link>
          </h1>
          {displayLatestCourses}
        </div>
      </main>
      <aside className="col-md-2 bg-light">{<StudentRightAside />}</aside>
    </section>
  );
};

export default Student;
