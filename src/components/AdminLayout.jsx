import { Outlet } from 'react-router-dom';
import AdminSidebar from './navigation/AdminSidebar';
import '../assets/styles/admin-layout.css';

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
      <AdminSidebar />
      <main className='App admin-content'>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
