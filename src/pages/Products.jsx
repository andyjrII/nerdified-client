import Navigation from "../components/navigation/Navigation";
import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "../api/axios";
import DefaultImage from "../assets/images/navpages/product-default.jpg";
import "../assets/styles/navpages.css";
import { motion } from "framer-motion";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState();
  const [imagePaths, setImagePaths] = useState([]);

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
              platform,
            },
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        fetchImages(currentPage, searchQuery, platform);
        setProducts(response.data.products);
        setTotalProducts(response.data.totalProducts);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchProducts();
  }, [currentPage, searchQuery, platform, products]);

  const fetchImages = async (currentPage, searchQuery, platform) => {
    try {
      const response = await axios.get(`products/images/${currentPage}`, {
        params: {
          search: searchQuery,
          platform,
        },
      });
      const imageUrls = response?.data; // Assuming the response contains an array of image URLs
      const imageBlobs = await Promise.all(
        imageUrls.map(async (imageUrl) => {
          const imageResponse = await axios.get(`products/image/${imageUrl}`, {
            responseType: "arraybuffer",
          });
          return new Blob([imageResponse.data], { type: "image/jpeg" });
        })
      );
      const images = imageBlobs.map((imageBlob) =>
        URL.createObjectURL(imageBlob)
      );
      setImagePaths(images);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const pageCount = Math.ceil(totalProducts / productsPerPage);

  const displayProducts = products.map((product, index) => {
    return (
      <motion.div layout className="mb-4" key={product.id}>
        <div className="card shadow-sm">
          <img
            src={imagePaths[index] || DefaultImage}
            className="bd-placeholder-img card-img-top"
            alt={product.title}
            height="180px"
          />
          <div className="card-body">
            <h6 className="text-center">{product.title}</h6>
            <p className="card-text text-center">{product.description}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <Link
                  type="button"
                  className="btn btn-sm"
                  id="product-url"
                  to={`https://${product.url}`}
                  target="_blank"
                >
                  Live Demo
                </Link>
              </div>
              <small className="text-dark">{product.platform}</small>
            </div>
          </div>
        </div>
      </motion.div>
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

  return (
    <>
      <Navigation />
      <header className="py-3 bg-light border-bottom mb-4 header-bg">
        <div className="container">
          <div className="my-3 text-center">
            <p className="h1">
              <span className="badge bg-danger">Products</span>
            </p>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Search filter for Products */}
        <div className="p-3 pb-md-4 mx-auto row">
          <div className="col-sm-8 mb-4">
            <input
              type="text"
              className="form-control bg-dark text-white"
              placeholder="Search for Product..."
              aria-label="Search"
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>
          <div className="col-sm-4">
            <select
              className="form-select bg-dark texy-white"
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Choose Platform</option>
              <option value="DESKTOP">Desktop</option>
              <option value="MOBILE">Mobile</option>
              <option value="WEB">Web</option>
            </select>
          </div>
        </div>

        {/* Product */}
        <div className="album py-3">
          <div className="container">
            <motion.div
              layout
              className="row row-cols-1 row-cols-md-4 text-center justify-content-center"
            >
              {displayProducts}
            </motion.div>
          </div>
        </div>

        {/* Pagination */}
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
      <Footer />
    </>
  );
};

export default Products;
