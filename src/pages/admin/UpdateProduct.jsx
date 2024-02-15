import AdminSidebar from "../../components/navigation/AdminSidebar";
import { useRef, useState, useEffect } from "react";
import axios from "../../api/axios";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import "../../assets/styles/admin.css";

const UpdateProduct = () => {
  const axiosPrivate = useAdminAxiosPrivate();
  const errRef = useRef();

  const [productId, setProductId] = useState(1);
  const [title, setTitle] = useState(undefined);
  const [description, setDescription] = useState();
  const [platform, setPlatform] = useState(undefined);
  const [url, setUrl] = useState();
  const [product, setProduct] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [title, description, platform, url, selectedImage, productId]);

  const handleSelect = (e) => {
    setPlatform(e.target.value);
  };

  const handleTextarea = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const getProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`products/find/${productId}`);
      if (!response.data) alert("Product does not exist");
      setProduct(response?.data);
    } catch (err) {
      setErrMsg("Product does not exist");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.patch(
        `products/update/${productId}`,
        JSON.stringify({ title, description, platform, url }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      if (selectedImage) await imageUpload(response?.data.id);
      setProduct(response?.data);
      alert(`${product.title} was updated!`);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Credentials");
      } else if (err.response?.status === 403) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Update Failed");
      }
      errRef.current.focus();
    }
  };

  const imageUpload = async (id) => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    if (!selectedImage) return;
    try {
      await axios.patch(`products/upload/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
    } catch (err) {
      setErrMsg("Image upload Failed");
      errRef.current.focus();
    }
  };

  return (
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='text-center'>Product Update</h1>
        </div>

        <div className='p-3 pb-md-4 mx-auto row'>
          {/* search filter for products */}
          <div className='mb-4'>
            <form onSubmit={getProduct}>
              <div className='row g-3'>
                <div className='col-sm-3'>
                  <div className='input-group mb-2'>
                    <input
                      type='number'
                      className='form-control text-white bg-dark'
                      aria-label='Product Id'
                      onChange={(e) => setProductId(e.target.value)}
                      value={productId}
                      placeholder='Product ID'
                      required
                    />
                  </div>
                </div>
                <div className='col-sm-3'>
                  <button className='btn bg-dark text-white btn-lg'>
                    Find Product
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Form for updating product */}
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </p>
          {product && (
            <form onSubmit={handleSubmit}>
              <div className='row g-3'>
                <div className='col-sm-7'>
                  <div className='input-group mb-2'>
                    <span
                      className='input-group-text bg-dark text-white'
                      id='product-name'>
                      Name
                    </span>
                    <input
                      type='text'
                      className='form-control bg-dark text-white'
                      placeholder={product.title}
                      aria-label='Product Name'
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                  </div>
                </div>

                <div className='col-sm-5'>
                  <div className='input-group mb-2'>
                    <select
                      className='form-select bg-dark text-white'
                      id='platform'
                      value={platform}
                      onChange={handleSelect}>
                      <option>{product.platform}</option>
                      <option value='DESKTOP'>Desktop</option>
                      <option value='MOBILE'>Mobile</option>
                      <option value='WEB'>Web</option>
                    </select>
                    <span
                      className='input-group-text bg-dark text-white'
                      id='platform'>
                      Platform
                    </span>
                  </div>
                </div>

                <div className='input-group'>
                  <span className='input-group-text bg-dark text-white'>
                    Description
                  </span>
                  <textarea
                    className='form-control bg-dark text-white'
                    aria-label='Description'
                    value={description}
                    onChange={handleTextarea}
                    defaultValue={product.description}
                  />
                </div>

                <div className='col-sm-7'>
                  <div className='input-group mb-2'>
                    <input
                      type='text'
                      className='form-control bg-dark text-white'
                      id='demo-url'
                      onChange={(e) => setUrl(e.target.value)}
                      value={url}
                      placeholder={product.url}
                    />
                    <span
                      className='input-group-text bg-dark text-white'
                      id='demo-url'>
                      Demo URL
                    </span>
                  </div>
                </div>

                <div className='col-sm-5'>
                  <div className='input-group mb-2'>
                    <span
                      className='input-group-text bg-dark text-white'
                      id='image'>
                      Upload Image
                    </span>
                    <input
                      type='file'
                      className='form-control bg-dark text-white'
                      id='image'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className='text-center'>
                  <button className='btn bg-danger btn-lg text-white w-50'>
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default UpdateProduct;
