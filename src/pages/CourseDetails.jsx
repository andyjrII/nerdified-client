import { useState, useEffect, useRef } from "react";
import Navigation from "../components/navigation/Navigation";
import Footer from "../components/footer/Footer";
import "../assets/styles/navpages.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Viewer from "viewerjs";
import Moment from "react-moment";
import { SiLevelsdotfyi } from "react-icons/si";
import { FaClock, FaDollarSign } from "react-icons/fa";
import { PaystackButton } from "react-paystack";
import { useNavigate, Link } from "react-router-dom";
import Missing from "./Missing";

const publicKey = "pk_test_244916c0bd11624711bdab398418c05413687296";

const CourseDetails = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const course = JSON.parse(localStorage.getItem("NERDVILLE_COURSE"));
  if (course) {
    var courseId = course.id;
    var amount = course.price;
    var courseTitle = course.title;
  }
  const email = localStorage.getItem("STUDENT_EMAIL");
  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  const reference = localStorage.getItem("PAYMENT_REFERENCE");

  const pdfViewerRef = useRef();

  const [pdfData, setPdfData] = useState();

  useEffect(() => {
    const getCourseOutline = async () => {
      try {
        const response = await axiosPrivate.get(
          `courses/get-outline/${courseId}`,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
            responseType: "arraybuffer", // Specify that the response should be treated as binary data
          }
        );
        const pdfBlob = new Blob([response.data], {
          type: "application/pdf",
        });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdfData(pdfUrl);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (course) getCourseOutline();
  }, [courseId]);

  useEffect(() => {
    if (pdfData) {
      const viewer = new Viewer(pdfViewerRef.current, {
        inline: true,
        title: false,
        navbar: false,
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          oneToOne: 1,
          reset: 1,
          prev: 0,
          play: {
            show: 1,
            size: "large",
          },
          next: 0,
          rotateLeft: 0,
          rotateRight: 0,
          flipHorizontal: 0,
          flipVertical: 0,
        },
      });
      return () => {
        viewer.destroy();
      };
    }
  }, [pdfData]);

  const paymentsProps = {
    email,
    amount: parseFloat(amount * 100),
    metadata: {
      "Course Title": courseTitle,
    },
    publicKey,
    text: "Pay Now",
    onSuccess: (response) => {
      const message =
        "Payment with Reference: " +
        response.reference +
        " complete! Thanks for doing business with us! Come back soon!!";
      localStorage.setItem(
        "PAYMENT_REFERENCE",
        JSON.stringify(response.reference)
      );
      savePaymentInfo();
      alert(message);
      navigate("/courses", { replace: true });
    },
    onClose: () => alert("Wait! You need this course, don't go!!!!"),
  };

  const savePaymentInfo = async () => {
    try {
      await axiosPrivate.post(
        `students/enroll`,
        JSON.stringify({ email, courseId, amount, reference }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {course ? (
        <>
          <Navigation />
          <header className="py-3 bg-light border-bottom mb-4 header-bg">
            <div className="container">
              <div className="text-center my-3">
                <p className="h1">
                  <span className="badge bg-danger">{courseTitle}</span>
                </p>
              </div>
            </div>
          </header>

          {/* Course Payment */}
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4 mt-5">
                <div className="modal-content rounded-4 shadow">
                  <div className="modal-body p-3">
                    <div className="payment-head rounded py-2">
                      <h5 className="fw-bold text-center text-white">
                        Payment Details
                      </h5>
                    </div>
                    <ul className="d-grid gap-4 list-unstyled p-3">
                      <li className="d-flex gap-4">
                        <SiLevelsdotfyi className="bi text-success flex-shrink-0" />
                        <div>
                          <h5 className="mb-0 section-heading">Level</h5>
                          <span className="text-success">{course.level}</span>
                        </div>
                      </li>
                      <li className="d-flex gap-4">
                        <FaClock className="bi text-danger flex-shrink-0" />
                        <div>
                          <h5 className="mb-0 section-heading">Start Date</h5>
                          <span className="text-danger">
                            <Moment format="MMMM D, YYYY">
                              {course.deadline}
                            </Moment>
                          </span>
                        </div>
                      </li>
                      <li className="d-flex gap-4">
                        <FaDollarSign className="bi text-warning flex-shrink-0" />
                        <div>
                          <h5 className="mb-0 section-heading">Price</h5>
                          <span className="text-warning">
                            &#8358;{course.price}.00
                          </span>
                        </div>
                      </li>
                      <li className="d-flex text-center fs-5">
                        {course.description}
                      </li>
                    </ul>
                    <div className="text-center pt-0">
                      {accessToken && email ? (
                        <PaystackButton
                          type="button"
                          className="btn btn-lg text-white pay-button fw-bold"
                          {...paymentsProps}
                        />
                      ) : (
                        <Link
                          to="/signin"
                          className="btn btn-lg text-white pay-button fw-bold"
                        >
                          Login to Pay!
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* PDF Viewer */}
              <div className="col-md-8">
                <div className="my-4">
                  <div ref={pdfViewerRef} className="viewer-container">
                    {pdfData && (
                      <embed
                        src={pdfData}
                        type="application/pdf"
                        width="100%"
                        height="600"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Missing />
      )}
      <Footer />
    </>
  );
};

export default CourseDetails;
