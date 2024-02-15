import { useState, useEffect } from "react";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import "../../assets/styles/admin.css";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import ReactPaginate from "react-paginate";
import Moment from "react-moment";

const CoursePayment = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const [payments, setPayments] = useState([]);
  const [totalPayments, setTotalPayments] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState();
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [newStatus, setNewStatus] = useState();
  const [courseTitle, setCourseTitle] = useState("");

  const paymentsPerPage = 30;

  useEffect(() => {
    axiosPrivate
      .get("courses/all/titles")
      .then((response) => {
        setCourseOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching course titles:", error);
      });
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosPrivate.get(
          `courses/payments/${currentPage}`,
          {
            params: {
              search: searchQuery,
              status
            }
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        setPayments(response.data.payments);
        setTotalPayments(response.data.totalPayments);
        setCourseTitle(response.data.course.title);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPayments();
  }, [currentPage, searchQuery, status, payments]);

  const pageCount = Math.ceil(totalPayments / paymentsPerPage);

  const displayPayments = payments.map((payment) => {
    return (
      <tr
        key={payment.id}
        className={`bg-${
          payment.id % 2 === 0 ? "black" : "danger"
        } text-white`}>
        <th>{payment.id}</th>
        <td>{payment.student.email}</td>
        <td>{payment.course.title}</td>
        <td>&#8358;{payment.paidAmount}</td>
        <td>
          <Moment format='DD/MM/YYYY'>{payment.dateEnrolled}</Moment>
        </td>
        <td>{payment.status}</td>
      </tr>
    );
  });

  const changePage = ({ selected }) => {
    selected += 1;
    setCurrentPage(selected);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const courseId = parseInt(id);
    try {
      const response = await axiosPrivate.patch(
        `courses/update_status/${currentPage}`,
        JSON.stringify({
          courseId,
          status: newStatus
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      setPayments(response.data);
      alert(`Course successfully updated!`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id='wrapper'>
      <AdminSidebar />
      <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
        <div className='pt-3 pb-2 mb-3 border-bottom'>
          <h1 className='text-center'>Course Payments</h1>
        </div>

        {/* Search filter for Courses */}
        <div className='p-3 pb-md-4 mx-auto row'>
          <div className='col-sm-8 mb-4'>
            <input
              type='text'
              className='form-control bg-dark text-white'
              placeholder='Search for Course...'
              aria-label='Search'
              onChange={handleSearchChange}
              value={searchQuery}
            />
          </div>

          <div className='col-sm-4'>
            <select
              className='form-select bg-dark text-white'
              id='status'
              value={status}
              onChange={(e) => setStatus(e.target.value)}>
              <option value=''>Choose Status</option>
              <option value='PENDING'>Pending</option>
              <option value='STARTED'>Started</option>
              <option value='DROPPED'>Dropped</option>
              <option value='FINISHED'>Finished</option>
            </select>
          </div>
        </div>

        {/* Updating Courses Status */}
        <div className='p-3 pb-md-4 mx-auto row'>
          <h2 className='text-dark'>Update Course Status:</h2>
          <div className='col-sm-5 mb-4'>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className='form-select bg-dark text-white'
              id='course-select'>
              <option value=''>Select a course</option>
              {courseOptions.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className='col-sm-4 mb-4'>
            <select
              className='form-select bg-dark text-white'
              id='new-status'
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}>
              <option value=''>New Status</option>
              <option value='PENDING'>Pending</option>
              <option value='STARTED'>Started</option>
              <option value='DROPPED'>Dropped</option>
              <option value='FINISHED'>Finished</option>
            </select>
          </div>

          <div className='col-sm-3'>
            <button
              className='btn btn-lg bg-danger text-white'
              onClick={() => handleStatusUpdate(selectedCourse, newStatus)}
              disabled={selectedCourse && newStatus ? false : true}>
              Update
            </button>
          </div>
        </div>

        {/* Course Payments made */}
        <div className='pt-3 pb-3 mb-3 px-3 mx-3'>
          <table className='table'>
            <thead>
              <tr className='bg-black text-white'>
                <th scope='col'>Id</th>
                <th scope='col'>Student Email</th>
                <th scope='col'>Course Title</th>
                <th scope='col'>Price</th>
                <th scope='col'>Payment Date</th>
                <th scope='col'>Course Status</th>
              </tr>
            </thead>
            <tbody>{displayPayments}</tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='bd-example'>
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

export default CoursePayment;
