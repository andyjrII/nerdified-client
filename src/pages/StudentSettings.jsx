import "../assets/styles/student.css";
import StudentNavItems from "../components/navigation/StudentNavItems";
import PasswordChange from "../components/forms/PasswordChange";
import ImageChange from "../components/forms/ImageChange";

const StudentSettings = () => {
  return (
    <section className="row mb-0">
      <aside className="col-md-1 bg-light">
        <StudentNavItems />
      </aside>
      <main className="col-md-11">
        <p className="h1 text-center py-4">
          <span className="badge bg-danger">Change Settings</span>
        </p>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 mb-5">
              <PasswordChange />
            </div>
            <div className="col-lg-4">
              <ImageChange />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default StudentSettings;
