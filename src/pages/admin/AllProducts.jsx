import AdminSidebar from "../../components/navigation/AdminSidebar";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import "../../assets/styles/admin.css";
import axios from "../../api/axios";
import ReactPaginate from "react-paginate";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";

const AllProducts = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState();

  const productsPerPage = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `products/${currentPage}`,
          {
            params: {
              search: searchQuery,
              platform
            }
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        setProducts(response.data.products);
        setTotalProducts(response.data.totalProducts);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, [currentPage, searchQuery, platform, products]);

  const pageCount = Math.ceil(totalProducts / productsPerPage);

  const displayProducts = products.map((product) => {
    return (
      <tr key={product.id} className='bg-danger text-white'>
        <th className='bg-black'>{product.id}</th>
        <td>{product.title}</td>
        <td>{product.platform}</td>
        <td>{product.url}</td>
        <td className='bg-black'>
          <FaTrashAlt
            role='button'
            tabIndex='0'
            onClick={() => handleDelete(product.id)}
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
      const response = await axiosPrivate.delete(`products/${id}`);
      alert(`${response?.data.title} successfully deleted!`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='text-center'>Store</h1>
        </div>

        {/* Search filter for Products */}
        <div className='p-3 pb-md-4 mx-auto row'>
          <div className='col-sm-8 mb-4'>
            <input
              type='text'
              className='form-control bg-dark text-white'
              placeholder='Search for Product'
              aria-label='Search'
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          <div className='col-sm-4'>
            <select
              className='form-select bg-dark text-white'
              id='platform'
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}>
              <option value=''>Choose Platform</option>
              <option value='DESKTOP'>Desktop</option>
              <option value='MOBILE'>Mobile</option>
              <option value='WEB'>Web</option>
            </select>
          </div>
        </div>

        {/* List of all Products */}
        <table className='table'>
          <thead>
            <tr className='bg-black text-white'>
              <th scope='col'>Id</th>
              <th scope='col'>Name</th>
              <th scope='col'>Platform</th>
              <th scope='col'>Demo Link</th>
              <th scope='col'></th>
            </tr>
          </thead>
          {/* Display Courses */}
          <tbody>{displayProducts}</tbody>
        </table>

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

export default AllProducts;
