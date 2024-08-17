import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import useAdminAxiosPrivate from '../../hooks/useAdminAxiosPrivate';
import ReactPaginate from 'react-paginate';
import Moment from 'react-moment';
import Swal from 'sweetalert2';

const BlogPosts = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const postsPerPage = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosPrivate.get(`admin/blogs/${currentPage}`, {
          params: {
            search: searchQuery,
            startDate,
            endDate,
          },
        });
        setPosts(response.data.posts);
        setTotalPosts(response.data.totalPosts);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchPosts();
  }, [currentPage, searchQuery, startDate, endDate]);

  const pageCount = Math.ceil(totalPosts / postsPerPage);

  const displayPosts = posts.map((post) => {
    return (
      <tr key={post.id} className='bg-danger text-white'>
        <th className='bg-black'>{post.id}</th>
        <td>{post.title}</td>
        <td>{post.postUrl}</td>
        <td>
          <Moment format='DD/MM/YYYY'>{post.datePosted}</Moment>
        </td>
        <td className='bg-black'>
          <FaEdit
            role='button'
            tabIndex='0'
            title='Edit Blog Post'
            onClick={() => handleEdit(post.id)}
          />
        </td>
        <td className='bg-black'>
          <FaTrashAlt
            role='button'
            tabIndex='0'
            title='Delete Blog Post'
            onClick={() => handleDelete(post.id)}
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

  const handleEdit = async (id) => {
    localStorage.setItem('EDIT_POST_ID', id);
    navigate(`/admin/posts/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosPrivate.delete(`blog/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Post Deleted',
        text: `${response.data.title} deleted successfully`,
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
        <h1 className='text-center'>Blog Posts</h1>
      </div>

      {/* Search filter for Posts */}
      <div className='row mx-auto g-3'>
        <div className='col-md-4 mb-2'>
          <input
            type='text'
            className='form-control bg-dark text-white'
            placeholder='Search for Post...'
            aria-label='Search'
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>

        <div className='col-md-4 mb-2'>
          <div className='input-group'>
            <span
              className='input-group-text bg-dark text-white'
              id='start-date'
            >
              Start Date
            </span>
            <input
              type='date'
              className='form-control bg-dark text-white'
              id='start-date'
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <div className='col-md-4 mb-2'>
          <div className='input-group'>
            <input
              type='date'
              className='form-control bg-dark text-white'
              id='end-date'
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              min={startDate}
            />
            <span className='input-group-text bg-dark text-white' id='end-date'>
              End Date
            </span>
          </div>
        </div>
      </div>

      {/* List of all Posts */}
      <table className='table mt-3'>
        <thead>
          <tr className='bg-black text-white'>
            <th scope='col'>Id</th>
            <th scope='col'>Title</th>
            <th scope='col'>Post Url</th>
            <th scope='col'>Post Date</th>
            <th scope='col'></th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>{displayPosts}</tbody>
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

export default BlogPosts;
