import { Routes, Route } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import AdminRequireAuth from './auth/AdminRequireAuth';
import PersistLogin from './auth/PersistLogin';
import AdminPersistLogin from './auth/AdminPersistLogin';
import Layout from './components/Layout';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import Missing from './pages/Missing';
import Courses from './pages/Courses';
import Student from './pages/Student';
import CourseDetails from './pages/CourseDetails';
import Admin from './pages/admin/Admin';
import UpdateCourse from './pages/admin/UpdateCourse';
import AllStudents from './pages/admin/AllStudents';
import CoursePayment from './pages/admin/CoursePayment';
import NewCourse from './pages/admin/NewCourse';
import AllCourses from './pages/admin/AllCourses';
import Blog from './pages/Blog';
import BlogPosts from './pages/admin/BlogPosts';
import NewPost from './pages/admin/NewPost';
import UpdatePost from './pages/admin/UpdatePost';
import AdminSignin from './pages/admin/AdminSignin';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import StudentSettings from './pages/StudentSettings';
import CreateAdmin from './pages/admin/CreateAdmin';
import AllAdmins from './pages/admin/AllAdmins';
import AdminSignup from './pages/admin/AdminSignup';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='courses' element={<Courses />} />
        <Route path='courses/course' element={<CourseDetails />} />
        <Route path='blog' element={<Blog />} />
        <Route path='about' element={<About />} />

        <Route path='unauthorized' element={<Unauthorized />} />

        {/* User protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path='student' element={<Student />} />
            <Route path='student/settings' element={<StudentSettings />} />
          </Route>
        </Route>

        {/* Admin Public Routes */}
        <Route path='admin_signin' element={<AdminSignin />} />
        <Route path='admin_signup' element={<AdminSignup />} />

        {/* Admin Protected Routes */}
        <Route element={<AdminPersistLogin />}>
          <Route element={<AdminRequireAuth />}>
            <Route path='admin' element={<Admin />} />
            <Route path='admin_new_course' element={<NewCourse />} />
            <Route path='admin_courses' element={<AllCourses />} />
            <Route path='admin_update_course' element={<UpdateCourse />} />
            <Route path='admin_students' element={<AllStudents />} />
            <Route path='admin_course_payment' element={<CoursePayment />} />
            <Route path='admin_blog_posts' element={<BlogPosts />} />
            <Route path='admin_new_post' element={<NewPost />} />
            <Route path='admin_update_post' element={<UpdatePost />} />
            <Route path='admin_all' element={<AllAdmins />} />
            <Route path='admin_new_admin' element={<CreateAdmin />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
