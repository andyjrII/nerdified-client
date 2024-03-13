import { useState, useEffect } from "react";
import AdminSidebar from "../../components/navigation/AdminSidebar";
import useAdminAxiosPrivate from "../../hooks/useAdminAxiosPrivate";
import "../../assets/styles/admin.css";
import { FaBlog, FaUserAlt } from "react-icons/fa";
import { IoSchool } from "react-icons/io5";
import PaymentsPieChart from "../../components/charts/PaymentsPiechart";
import PaymentsLineChart from "../../components/charts/PaymentsLineChart";

const Admin = () => {
  const axiosPrivate = useAdminAxiosPrivate();

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    getTotals();
  }, []);

  const getTotals = async () => {
    try {
      const response = await axiosPrivate.get("admin/totals");
      setTotalStudents(response.data[0]);
      setTotalCourses(response.data[1]);
      setTotalPosts(response.data[2]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id="wrapper">
      <AdminSidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <div className="container-fluid">
            <div className="d-sm-text-center mb-4 pt-4">
              <h1 className="h3 mb-0 text-black-800">Dashboard</h1>
            </div>

            {/* Content Row */}
            <div className="row">
              {/* Total Students card */}
              <div className="col-xl-4 col-md-4 mb-4">
                <div className="card border-left-primary shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                          Total Students
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {totalStudents}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fa-2x text-gray-300">
                          <FaUserAlt />
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Courses card */}
              <div className="col-xl-4 col-md-4 mb-4">
                <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                          Total Courses
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {totalCourses}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fa-2x text-gray-300">
                          <IoSchool />
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Posts card */}
              <div className="col-xl-4 col-md-4 mb-4">
                <div className="card border-left-warning shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Total Blog Posts
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {totalPosts}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="fa-2x text-gray-300">
                          <FaBlog />
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Row */}

            <div className="row">
              {/* Line Chart */}
              <div className="col-xl-8 col-lg-7">
                <div className="card shadow mb-4 chart-area">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Earnings Overview
                    </h6>
                  </div>
                  {/* Card Body */}
                  <div className="card-body pb-5">
                    <PaymentsLineChart />
                  </div>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="col-xl-4 col-lg-5">
                <div className="card shadow mb-4 chart-area">
                  <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Revenue Sources
                    </h6>
                  </div>
                  {/* Card Body */}
                  <div className="card-body p-2">
                    <PaymentsPieChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
