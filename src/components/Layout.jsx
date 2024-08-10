import { Outlet } from 'react-router-dom';
import Navigation from './navigation/Navigation';
import Footer from './Footer';

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
