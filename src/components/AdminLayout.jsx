import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <main className='App'>
      <Outlet />
    </main>
  );
};

export default AdminLayout;
