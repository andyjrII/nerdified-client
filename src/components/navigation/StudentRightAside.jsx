import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentProfile from "../../assets/images/navpages/person_profile.jpg";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useStudent from "../../hooks/useStudent";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHomeSharp, IoSchool, IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";

const StudentRightAside = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("STUDENT_EMAIL");

  const { student, setStudent } = useStudent();
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    fetchStudent();
  }, []);

  useEffect(() => {
    fetchImage();
  }, [imagePath]);

  const fetchStudent = async () => {
    try {
      const response = await axiosPrivate.get(`students/${email}`);
      setStudent(response?.data);
    } catch (error) {
      console.error("Error:", error);
      navigate("/signin", { state: { from: location }, replace: true });
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: "arraybuffer", // Set the response type to 'arraybuffer'
      });
      const imageBlob = new Blob([response.data], { type: "image/jpeg" }); // Create a Blob from the binary data
      const imageUrl = URL.createObjectURL(imageBlob); // Create a temporary URL for the image
      setImagePath(imageUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="side-inner text-center">
      <div className="profile mt-5">
        <Link to="/student/settings">
          <img src={imagePath ? imagePath : StudentProfile} alt="Student" />
        </Link>
        <p className="h3 name">
          <span className="badge bg-danger">{student.name}</span>
        </p>
        <IoHomeSharp className="side-icon mt-3" />
        <span className="address my-2">{student.address}</span>
        <IoMail className="side-icon" />
        <span className="email my-2">{student.email}</span>
        <FaPhone className="side-icon" />
        <span className="phone my-2">{student.phoneNumber}</span>
        <IoSchool className="side-icon" />
        <span className="academic my-2">{student.academicLevel}</span>
      </div>
    </div>
  );
};

export default StudentRightAside;
