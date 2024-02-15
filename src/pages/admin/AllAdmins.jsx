import { useState, useEffect } from "react";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../assets/styles/admin.css";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import { FaTrashAlt } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const AllAdmins = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const role = localStorage.getItem("ROLE");

  const [admins, setAdmins] = useState([]);
  const [totalAdmins, setTotalAdmins] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const adminsPerPage = 20;

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axiosPrivate.get(
          `admin/all/${currentPage}`,
          {
            params: {
              search: searchQuery,
              role
            }
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        setAdmins(response.data.admins);
        setTotalAdmins(response.data.totalAdmins);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchAdmins();
  }, [currentPage, searchQuery, admins]);

  const pageCount = Math.ceil(totalAdmins / adminsPerPage);

  const displayAdmins = admins.map((admin) => {
    return (
      <tr
        key={admin.id}
        className={`bg-${admin.id % 2 === 0 ? "black" : "danger"} text-white`}>
        <td>{admin.name}</td>
        <td>{admin.email}</td>
        <td>{admin.role}</td>
        <th>{admin.id}</th>
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
          role
        }
      });
      alert(`${response?.data.name} successfully deleted!`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='text-center'>All Admins</h1>
        </div>

        {/* Search filter for admins */}
        <div className='p-3 pb-md-4 mx-auto row'>
          <div className='col-sm-8 mb-4'>
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
                <th scope='col'>Name</th>
                <th scope='col'>Email</th>
                <th scope='col'>Role</th>
                <th scope='col'>Id</th>
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

export default AllAdmins;
