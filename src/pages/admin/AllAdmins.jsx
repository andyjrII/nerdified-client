import { useState, useEffect } from 'react';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import { FaTrashAlt } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import db from '../../utils/localBase';
import Swal from 'sweetalert2';

const AllAdmins = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const [role, setRole] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchRole();
        console.log(role);
      } catch (error) {
        console.error('Error fetching role from localBase:', error);
      }
    };

    initializeData();
  }, []);

  const fetchRole = async () => {
    const data = await db.collection('auth_admin').get();
    setRole(data[0].role);
  };

  const [admins, setAdmins] = useState([]);
  const [totalAdmins, setTotalAdmins] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const adminsPerPage = 20;

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosPrivate.get(`admin/all/${currentPage}`, {
          params: {
            search: searchQuery,
            role,
          },
        });
        setAdmins(response.data.admins);
        setTotalAdmins(response.data.totalAdmins);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchAdmins();
  }, [currentPage, searchQuery]);

  const pageCount = Math.ceil(totalAdmins / adminsPerPage);

  const displayAdmins = admins.map((admin) => {
    return (
      <tr key={admin.id} className='bg-danger text-white'>
        <th className='bg-black text-white'>{admin.id}</th>
        <td>{admin.name}</td>
        <td>{admin.email}</td>
        <td>{admin.role}</td>
        <td className='bg-black'>
          <FaTrashAlt
            role='button'
            tabIndex='0'
            onClick={() => handleDelete(admin.id)}
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
      const response = await axiosPrivate.delete(`admin/${id}`, {
        params: {
          role,
        },
      });
      alert(`${response?.data.name} successfully deleted!`);
      Swal.fire({
        icon: 'success',
        title: 'Delete Success',
        text: `${response.data.name} deleted successfully`,
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Delete Failed!',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className='container-fluid'>
      <div className='pt-3 pb-2 mb-3 border-bottom'>
        <h1 className='text-center'>All Admins</h1>
      </div>

      {/* Search filter for admins */}
      <div className='p-3 pb-md-4 mx-auto row'>
        <div className='col-md-12 mb-2'>
          <input
            type='text'
            className='form-control bg-dark text-white'
            placeholder='Search for admin...'
            aria-label='Search'
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>
      </div>

      {/* List of all admins */}
      <div className='bd-example'>
        <table className='table'>
          <thead>
            <tr className='bg-black text-white'>
              <th scope='col'>Id</th>
              <th scope='col'>Name</th>
              <th scope='col'>Email</th>
              <th scope='col'>Role</th>
              <th scope='col'></th>
            </tr>
          </thead>
          {/* Display admins */}
          <tbody>{displayAdmins}</tbody>
        </table>
      </div>

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

export default AllAdmins;
