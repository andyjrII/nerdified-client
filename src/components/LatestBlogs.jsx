import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import '../assets/styles/home.css';

const LatestBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [imagePaths, setImagePaths] = useState([]);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await axios.get('blog/posts/latest');
        fetchImages();
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching latest blogs:', error);
      }
    };

    fetchLatestBlogs();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('blog/posts/latest/images');
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
      console.error('Error:', error);
    }
  };

  const displayLatestPosts = blogs.map((blog, index) => {
    return (
      <div className='blog-card' key={blog.id}>
        <img src={imagePaths[index]} alt={blog.title} className='blog-image' />
        <h3 className='blog-title'>{blog.title}</h3>
        <p className='blog-date'>
          Posted on: <Moment format='MMMM D, YYYY'>{blog.datePosted}</Moment>
        </p>
        <Link to={`https://${blog.postUrl}`} className='read-more-button'>
          Read More
        </Link>
      </div>
    );
  });

  return (
    <div className='latest-blogs-container'>
      <div className='blogs-row'>{displayLatestPosts}</div>
    </div>
  );
};

export default LatestBlogs;
