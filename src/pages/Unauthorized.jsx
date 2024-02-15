import { useNavigate } from "react-router-dom";
import "../assets/styles/unauthorized.css";
import Hacker from "../assets/images/bg/unauthorized-bg.png";

function Unauthorized() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <>
      <header className='py-3 bg-light border-bottom mb-4 header-bg'>
        <div className='container'>
          <div className='text-center my-3'>
            <p className='h1'>
              <span className='badge bg-danger'>Unauthorized Page</span>
            </p>
          </div>
        </div>
      </header>
      <section className='p-0 m-0 text-center' id='unauthorized-bg'>
        <img src={Hacker} alt='...' id='hacker' />
        <div className='p-0 m-0'>
          <h3>You do not have access to the requested page!</h3>
          <button onClick={goBack} className='btn btn-lg bg-dark text-white'>
            Go Back
          </button>
        </div>
      </section>
    </>
  );
}

export default Unauthorized;
