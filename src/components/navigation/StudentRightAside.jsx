import { useEffect, useState } from "react";
import StudentProfile from "../../assets/images/navpages/person_profile.jpg";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useStudent from "../../hooks/useStudent";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHomeSharp, IoSchool, IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import Logo from "../../assets/images/logo.png";

const StudentRightAside = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("STUDENT_EMAIL");

  const { student, setStudent } = useStudent();
  const studentId = student.id;

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    fetchStudent();
    fetchImage();
  }, [selectedImage]);

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

  const imageSubmit = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      await axiosPrivate.patch(`students/upload/${studentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(`Image successfully updated!`);
      fetchImage();
      setSelectedImage(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = async (e) => {
    setSelectedImage(e.target.files[0]);
  };

  return (
    <div className="side-inner">
      <div className="profile">
        <label className="image-label mt-5" title="Upload Image">
          <input
            type="file"
            className="form-control"
            id="image-input"
            onChange={handleImageChange}
            accept="image/*"
          />
          <img
            src={imagePath ? imagePath : StudentProfile}
            alt="Student"
            className="img-fluid"
            id="student-image"
          />
        </label>
        {selectedImage && (
          <button
            className="btn btn-sm bg-danger text-white"
            onClick={() => imageSubmit()}
          >
            Submit
          </button>
        )}
        <h3 className="name">{student.name}</h3>
        <h2 className="text-danger mt-3">Information</h2>
        <span className="address my-2">
          <IoHomeSharp /> {student.address}
        </span>
        <span className="email my-2">
          <IoMail /> {student.email}
        </span>
        <span className="phone my-2">
          <FaPhone /> {student.phoneNumber}
        </span>
        <span className="academic my-2">
          <IoSchool /> {student.academicLevel}
        </span>
      </div>
      <img src={Logo} alt="Get Nerdified" className="side-logo" />
    </div>
  );
};

export default StudentRightAside;
