import { Link } from 'react-router-dom';
import '../assets/styles/navpages.css';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Moment from 'react-moment';
import ReactPaginate from 'react-paginate';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState();
  const [imagePaths, setImagePaths] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const postsPerPage = 20;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `blog/${currentPage}`,
          {
            params: {
              search: searchQuery,
              startDate,
              endDate,
            },
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        fetchImages(currentPage, searchQuery, startDate, endDate);
        setPosts(response.data.posts);
        setTotalPosts(response.data.totalPosts);
      } catch (error) {
        alert('Error getting posts');
      }
    };
    fetchPosts();
  }, [currentPage, searchQuery, startDate, endDate, posts]);

  const fetchImages = async (currentPage, searchQuery, endDate, startDate) => {
    try {
      const response = await axios.get(`blog/images/${currentPage}`, {
        params: {
          search: searchQuery,
          startDate,
          endDate,
        },
      });
      const imageUrls = response?.data; // Assuming the response contains an array of image URLs
      const imageBlobs = await Promise.all(
        imageUrls.map(async (imageUrl) => {
          const imageResponse = await axios.get(`blog/image/${imageUrl}`, {
            responseType: 'arraybuffer',
          });
          return new Blob([imageResponse.data], { type: 'image/jpeg' });
        })
      );
      const images = imageBlobs.map((imageBlob) =>
        URL.createObjectURL(imageBlob)
      );
      setImagePaths(images);
    } catch (error) {
      alert('Error fetching images');
    }
  };

  const pageCount = Math.ceil(totalPosts / postsPerPage);

  const displayPosts = posts.map((post, index) => {
    return (
      <div className='col-lg-6' key={post.id}>
        <div className='card mb-4'>
          <Link to={post.postUrl}>
            <img
              className='card-img-top post-image'
              src={imagePaths[index]}
              alt='...'
            />
          </Link>
          <div className='card-body'>
            <div className='small text-muted'>
              <Moment format='MMMM D, YYYY'>{post.datePosted}</Moment>
            </div>
            <h2 className='card-title'>{post.title}</h2>
            <Link
              className='btn mt-2'
              to={`https://${post.postUrl}`}
              target='_blank'
            >
              Read more →
            </Link>
          </div>
        </div>
      </div>
    );
  });

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
  };

  return (
    <main>
      <header className='py-3 bg-light border-bottom mb-4 header-bg'>
        <div className='container'>
          <div className='text-center my-3'>
            <p className='h1'>
              <span className='badge bg-danger'>Blog</span>
            </p>
          </div>
        </div>
      </header>
      {/* Page content */}
      <div className='container'>
        <div className='row'>
          {/* Blog entries */}
          <div className='col-lg-8'>
            <div className='row'>{displayPosts}</div>
          </div>

          {/* Side widgets */}
          <div className='col-lg-4'>
            <div className='card mb-4'>
              <div className='card-header'>Search</div>
              <div className='card-body'>
                <div className='input-group'>
                  <input
                    className='form-control rounded'
                    type='text'
                    placeholder='Enter search term...'
                    aria-label='Enter search term...'
                    aria-describedby='button-search'
                    onChange={handleSearchChange}
                    value={searchQuery}
                  />
                </div>
              </div>
            </div>
            <div className='card mb-4'>
              <div className='card-header'>Time Frame</div>
              <div className='card-body'>
                <div className='row'>
                  <div className='input-group mb-3'>
                    <span className='input-group-text' id='start-date'>
                      Start Date
                    </span>
                    <input
                      type='date'
                      className='form-control rounded'
                      id='start-date'
                      onChange={(e) => setStartDate(e.target.value)}
                      value={startDate}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className='row'>
                  <div className='input-group mb-3'>
                    <span className='input-group-text' id='end-date'>
                      End Date
                    </span>
                    <input
                      type='date'
                      className='form-control rounded'
                      id='end-date'
                      onChange={(e) => setEndDate(e.target.value)}
                      value={endDate}
                      min={startDate}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className='row'>
          <nav aria-label='Pagination pt-5'>
            <hr className='my-0' />
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
          </nav>
        </div>
      </div>
    </main>
  );
};

export default Blog;
