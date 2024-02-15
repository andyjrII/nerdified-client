import AdminSidebar from "../../components/navigation/AdminSidebar";
import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import "../../assets/styles/admin.css";

const NewProduct = () => {
  const axios = useAxiosPrivate();

  const errRef = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setErrMsg("");
  }, [title, description, platform, url, selectedImage]);

  const handleSelect = (e) => {
    setPlatform(e.target.value);
  };

  const handleTextarea = (e) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "products/create",
        JSON.stringify({ title, description, platform, url }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      await imageUpload(response?.data.id);
      setProduct(response?.data);
      alert(`${title} successfully created!`);
      setTitle("");
      setDescription("");
      setPlatform("");
      setUrl("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Credentials");
      } else if (err.response?.status === 403) {
        setErrMsg("Unauthorized");
      } else if (err.response?.status === 500) {
        setErrMsg(`Product with ${url} already exists`);
      } else {
        setErrMsg("Product Creation Failed");
      }
      errRef.current.focus();
    }
  };

  const imageUpload = async (id) => {
    const formData = new FormData();
    formData.append("image", selectedImage);
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
          <h1 className='text-center'>New Product</h1>
        </div>

        <div className='p-3 pb-md-4 mx-auto row'>
          {/* Form for creating a new product */}
          <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}>
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            <div className='row g-3'>
              <div className='col-sm-7'>
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control bg-dark text-white'
                    placeholder='Product title'
                    aria-label='Product Name'
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                  />
                </div>
              </div>

              <div className='col-sm-5'>
                <div className='input-group mb-3'>
                  <select
                    className='form-select bg-dark text-white'
                    id='platform'
                    value={platform}
                    onChange={handleSelect}
                    required>
                    <option value=''>Platform</option>
                    <option value='DESKTOP'>Desktop</option>
                    <option value='MOBILE'>Mobile</option>
                    <option value='WEB'>Web</option>
                  </select>
                </div>
              </div>

              <div className='input-group'>
                <textarea
                  className='form-control bg-dark text-white'
                  aria-label='Description'
                  value={description}
                  onChange={handleTextarea}
                  placeholder='Product description...'
                  required
                />
              </div>

              <div className='col-sm-7'>
                <div className='input-group mb-3'>
                  <input
                    type='text'
                    className='form-control bg-dark text-white'
                    id='demo-link'
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                    required
                    placeholder='Product Demo URL'
                  />
                </div>
              </div>

              <div className='col-sm-5'>
                <div className='input-group mb-3'>
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
                    required
                  />
                </div>
              </div>
              <div className='text-center'>
                <button className='btn bg-danger text-white btn-lg w-50'>
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewProduct;
