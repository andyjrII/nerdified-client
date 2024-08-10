import { Outlet } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import Footer from './navigation/Footer';

const Layout = () => {
  return (
    <>
      <Navigation />
      <main className='App'>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
