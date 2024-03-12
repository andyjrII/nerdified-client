import { useState, useEffect } from "react";
import "../../assets/styles/signin.css";
import { FcImageFile } from "react-icons/fc";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useStudent from "../../hooks/useStudent";

const ImageChange = () => {
  const axiosPrivate = useAxiosPrivate();

  const email = localStorage.getItem("STUDENT_EMAIL");

  const { student } = useStudent();
  const studentId = student.id;

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    fetchImage();
  }, [selectedImage, imagePath]);

  const fetchImage = async () => {
    try {
      const response = await axiosPrivate.get(`students/image/${email}`, {
        responseType: "arraybuffer", // Set the response type to 'arraybuffer'
      });
      const imageBlob = new Blob([response.data], { type: "image/jpeg" }); // Create a Blob from the binary data
      const imageUrl = URL.createObjectURL(imageBlob); // Create a temporary URL for the image
      setImagePath(imageUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageSubmit = async () => {
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      await axiosPrivate.patch(`students/upload/${studentId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert(`Image successfully updated!`);
      fetchImage();
      setSelectedImage(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-wrap py-4">
      <h3 className="text-center mb-3">Image Change</h3>
      <img
        src={imagePath}
        alt="Student"
        className="img-fluid rounded-5"
        id="image-change"
      />
      <form
        className="login-form rounded shadow-lg"
        onSubmit={handleImageSubmit}
      >
        <div className="form-group">
          <div className="icon d-flex align-items-center justify-content-center">
            <span>
              <FcImageFile />
            </span>
          </div>
          <input type="file" className="form-control" accept="image/*" />
        </div>
        <div className="form-group w-100 py-3">
          <button className="form-control btn btn-primary rounded px-3">
            Submit Image
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageChange;
