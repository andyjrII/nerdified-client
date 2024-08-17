import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import Moment from 'react-moment';
import '../../assets/styles/admin.css';
import ReactPaginate from 'react-paginate';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import Swal from 'sweetalert2';

const AllCourses = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const coursesPerPage = 20;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosPrivate.get(
          `courses/${currentPage}`,
          {
            params: {
              search: searchQuery,
            },
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        setCourses(response.data.courses);
        setTotalCourses(response.data.totalCourses);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchCourses();
  }, [courses, currentPage, searchQuery]);

  const pageCount = Math.ceil(totalCourses / coursesPerPage);

  const displayCourses = courses.map((course) => {
    return (
      <tr key={course.id} className='bg-danger text-white'>
        <th className='bg-black'>{course.id}</th>
        <td>{course.title}</td>
        <td>{course.price}</td>
        <td>
          <Moment format='DD/MM/YYYY'>{course.updatedAt}</Moment>
        </td>
        <td className='bg-black'>
          <FaEdit
            role='button'
            tabIndex='0'
            title='Edit Course'
            onClick={() => handleEdit(course.id)}
          />
        </td>
        <td className='bg-black'>
          <FaTrashAlt
            role='button'
            tabIndex='0'
            title='Delete Course'
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
    localStorage.setItem('EDIT_COURSE_ID', id);
    navigate(`/admin/courses/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosPrivate.delete(`courses/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Delete Success',
        text: `${response?.data.title} deleted successfully`,
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error deleting course!',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className='container-fluid'>
      <div className='pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='text-center'>Courses</h1>
      </div>

      {/* Search filter for Courses */}
      <div className='p-3 pb-md-4 mx-auto row'>
        <div className='col-md-12 mb-3'>
          <input
            type='text'
            className='form-control bg-dark text-white'
            placeholder='Search for Course...'
            aria-label='Search'
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>
      </div>

      {/* List of all Courses */}
      <table className='table'>
        <thead>
          <tr className='bg-black text-white'>
            <th scope='col'>Id</th>
            <th scope='col'>Title</th>
            <th scope='col'>Price</th>
            <th scope='col'>Updated</th>
            <th scope='col'></th>
            <th scope='col'></th>
          </tr>
        </thead>
        {/* Display Courses */}
        <tbody>{displayCourses}</tbody>
      </table>

      {/* Pagination */}
      <div className='pt-5'>
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={'paginationBttns'}
          previousLinkClassName={'previousBttn'}
          nextLinkClassName={'nextBttn'}
          disabledClassName={'paginationDisabled'}
          activeClassName={'paginationActive'}
        />
      </div>
    </div>
  );
};

export default AllCourses;
