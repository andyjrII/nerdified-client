import AdminSidebar from "../../components/navigation/AdminSidebar";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Moment from "react-moment";
import "../../assets/styles/admin.css";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import ReactPaginate from "react-paginate";

const AllStudents = () => {
  const axios = useAdminAxiosPrivate();

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState();

  const studentsPerPage = 20;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `students/search/${currentPage}`,
          {
            params: {
              search: searchQuery,
              academicLevel: level
            }
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        setStudents(response.data.students);
        setTotalStudents(response.data.totalStudents);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchStudents();
  }, [currentPage, searchQuery, level, students]);

  const pageCount = Math.ceil(totalStudents / studentsPerPage);

  const displayStudents = students.map((student) => {
    return (
      <tr key={student.id} className='bg-danger text-white'>
        <th className='bg-black'>{student.id}</th>
        <td>{student.name}</td>
        <td>{student.email}</td>
        <td>{student.phoneNumber}</td>
        <td>
          <Moment format='DD/MM/YYYY'>{student.createdAt}</Moment>
        </td>
        <td>{student.academicLevel}</td>
        <td className='bg-black'>
          <FaTrashAlt
            role='button'
            tabIndex='0'
            onClick={() => handleDelete(student.id)}
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
    const query = e.target.value.trim();
    setSearchQuery(query);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`students/${id}`);
      alert(`${response?.data.name} was successfully deleted!`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='text-center'>Students</h1>
        </div>

        {/* Search filter for Students */}
        <div className='p-3 pb-md-4 mx-auto row'>
          <div className='col-sm-8 mb-4'>
            <input
              type='text'
              className='form-control bg-dark text-white'
              placeholder='Search for student...'
              aria-label='Search'
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>

          <div className='col-sm-4'>
            <select
              className='form-select bg-dark text-white'
              id='level'
              value={level}
              onChange={(e) => setLevel(e.target.value)}>
              <option value=''>Choose Academic Level</option>
              <option value='OLEVEL'>O'Level</option>
              <option value='ND'>ND</option>
              <option value='HND'>HND</option>
              <option value='BSC'>B.Sc</option>
              <option value='GRADUATE'>Graduate</option>
            </select>
          </div>
        </div>

        {/* List of all Students */}
        <div className='bd-example-snippet bd-code-snippet'>
          <div className='bd-example'>
            <table className='table'>
              <thead>
                <tr className='bg-black text-white'>
                  <th scope='col'>Id</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Phone Number</th>
                  <th scope='col'>Joined Date</th>
                  <th scope='col'>Academic Level</th>
                  <th scope='col'></th>
                </tr>
              </thead>
              <tbody>{displayStudents}</tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className='bd-example-snippet bd-code-snippet'>
          <div className='bd-example'>
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
        </div>
      </main>
    </div>
  );
};

export default AllStudents;
