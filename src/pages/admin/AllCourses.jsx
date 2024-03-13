import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Moment from "react-moment";
import "../../assets/styles/admin.css";
import ReactPaginate from "react-paginate";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";

const AllCourses = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState();

  const coursesPerPage = 20;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosPrivate.get(
          `courses/${currentPage}`,
          {
            params: {
              search: searchQuery,
              level,
            },
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        setCourses(response.data.courses);
        setTotalCourses(response.data.totalCourses);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourses();
  }, [currentPage, searchQuery, level, courses]);

  const pageCount = Math.ceil(totalCourses / coursesPerPage);

  const displayCourses = courses.map((course) => {
    return (
      <tr key={course.id} className="bg-danger text-white">
        <th className="bg-black">{course.id}</th>
        <td>{course.title}</td>
        <td>{course.level}</td>
        <td>&#8358;{course.price}.00</td>
        <td>
          <Moment format="DD/MM/YYYY">{course.deadline}</Moment>
        </td>
        <td className="bg-black">
          <FaEdit
            role="button"
            tabIndex="0"
            title="Edit Course"
            onClick={() => handleEdit(course.id)}
          />
        </td>
        <td className="bg-black">
          <FaTrashAlt
            role="button"
            tabIndex="0"
            title="Delete Course"
            onClick={() => handleDelete(course.id)}
          />
        </td>
      </tr>
    );
  });

  const changePage = ({ selected }) => {
    selected += 1;
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleEdit = async (id) => {
    localStorage.setItem("EDIT_COURSE_ID", id);
    navigate("/admin_update_course");
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosPrivate.delete(`courses/${id}`);
      alert(`${response?.data.title} successfully deleted!`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id="wrapper">
      {/* Sidebar */}
      <AdminSidebar />
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="pt-3 pb-2 mb-3 border-bottom">
          <h1 className="text-center">Courses</h1>
        </div>

        {/* Search filter for Courses */}
        <div className="p-3 pb-md-4 mx-auto row">
          <div className="col-sm-8 mb-4">
            <input
              type="text"
              className="form-control bg-dark text-white"
              placeholder="Search for Course..."
              aria-label="Search"
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>

          <div className="col-sm-4">
            <select
              className="form-select bg-dark text-white"
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">Choose Level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCE">Advance</option>
            </select>
          </div>
        </div>

        {/* List of all Courses */}
        <table className="table">
          <thead>
            <tr className="bg-black text-white">
              <th scope="col">Id</th>
              <th scope="col">Title</th>
              <th scope="col">Level</th>
              <th scope="col">Price</th>
              <th scope="col">Deadline</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          {/* Display Courses */}
          <tbody>{displayCourses}</tbody>
        </table>

        {/* Pagination */}
        <div className="pt-5">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"paginationBttns"}
            previousLinkClassName={"previousBttn"}
            nextLinkClassName={"nextBttn"}
            disabledClassName={"paginationDisabled"}
            activeClassName={"paginationActive"}
          />
        </div>
      </main>
    </div>
  );
};

export default AllCourses;
