import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentProfile from "../../assets/images/navpages/person_profile.jpg";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useStudent from "../../hooks/useStudent";
import { useLocation, useNavigate } from "react-router-dom";
import { IoHomeSharp, IoSchool, IoMail } from "react-icons/io5";
import {
  FaShoppingCart,
  FaQuestion,
  FaBlog,
  FaLock,
  FaPhone
} from "react-icons/fa";
import useLogout from "../../hooks/useLogout";

const StudentSidebar = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();

  const email = localStorage.getItem("STUDENT_EMAIL");

  const { student, setStudent } = useStudent();
  const studentId = student.id;

  const [totalCount, setTotalCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    fetchStudent();
    totalCourses();
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

  const totalCourses = async () => {
    try {
      const response = await axiosPrivate.get(`students/total/${email}`);
      setTotalCount(response?.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: "arraybuffer" // Set the response type to 'arraybuffer'
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
        withCredentials: true
      });
      fetchImage();
      setSelectedImage(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = async (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className='col-md-2'>
      <div className='side-inner'>
        <div className='profile'>
          <label className='image-label'>
            <input
              type='file'
              className='form-control'
              id='image-input'
              onChange={handleImageChange}
              accept='image/*'
            />
            <img
              src={imagePath ? imagePath : StudentProfile}
              alt='Student'
              className='img-fluid'
              id='student-image'
            />
          </label>
          {selectedImage && (
            <button
              className='btn btn-sm bg-danger text-white'
              onClick={() => imageSubmit()}>
              Submit
            </button>
          )}
          <h3 className='name'>{student.name}</h3>
          <span className='country'>
            <IoHomeSharp /> {student.address}
          </span>
          <span className='country'>
            <IoMail /> {student.email}
          </span>
          <span className='country'>
            <FaPhone /> {student.phoneNumber}
          </span>
          <span className='country'>
            <IoSchool /> {student.academicLevel}
          </span>
        </div>

        <div className='counter d-flex justify-content-center'>
          <div className='col'>
            <span className='number-label'>Total Courses</span>
            <strong className='number'>{totalCount}</strong>
          </div>
        </div>

        <div className='nav-menu'>
          <ul>
            <li>
              <Link to='/'>
                <span className='span-icons'>
                  <IoHomeSharp />
                </span>
                Home
              </Link>
            </li>
            <li>
              <Link to='/courses'>
                <span className='span-icons'>
                  <IoSchool />
                </span>
                Courses
              </Link>
            </li>
            <li>
              <Link to='/products'>
                <span className='span-icons'>
                  <FaShoppingCart />
                </span>
                Products
              </Link>
            </li>
            <li>
              <Link to='/blog'>
                <span className='span-icons'>
                  <FaBlog />
                </span>
                Blog
              </Link>
            </li>
            <li>
              <Link to='/about'>
                <span className='span-icons'>
                  <FaQuestion />
                </span>
                About
              </Link>
            </li>
            <li>
              <Link to='#' role='button' onClick={signOut}>
                <span className='span-icons'>
                  <FaLock />
                </span>
                Sign out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
