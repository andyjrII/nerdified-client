import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import AdminRequireAuth from './components/AdminRequireAuth';
import PersistLogin from './components/PersistLogin';
import AdminPersistLogin from './components/AdminPersistLogin';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import Missing from './pages/Missing';
import Courses from './pages/Courses';
import Student from './pages/student/Student';
import Wishlist from './pages/student/Wishlist';
import Settings from './pages/student/Settings';
import CourseDetails from './pages/CourseDetails';
import CourseEnrollment from './pages/CourseEnrollment';
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
import CreateAdmin from './pages/admin/CreateAdmin';
import AllAdmins from './pages/admin/AllAdmins';
import { StudentProvider } from './context/StudentProvider';
import { AdminProvider } from './context/AdminProvider';
import { AuthProvider } from './context/AuthProvider';
import Contact from './pages/Contact';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <StudentProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* public routes */}
              <Route path='/' element={<Home />} />
              <Route path='/signin' element={<Signin />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/courses' element={<Courses />} />
              <Route path='/courses/:id' element={<CourseDetails />} />
              <Route
                path='/courses/:id/payment'
                element={<CourseEnrollment />}
              />
              <Route path='/blog' element={<Blog />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />

              {/* Student protected routes */}
              <Route element={<PersistLogin />}>
                <Route element={<RequireAuth />}>
                  <Route path='student' element={<Student />} />
                  <Route path='student/wishlist' element={<Wishlist />} />
                  <Route path='student/picture' element={<Settings />} />
                </Route>
              </Route>
            </Route>

            <Route element={<AdminLayout />}>
              {/* Admin Protected Routes */}
              <Route element={<AdminPersistLogin />}>
                <Route element={<AdminRequireAuth />}>
                  <Route path='/admin' element={<Admin />} />
                  <Route path='/admins' element={<AllAdmins />} />
                  <Route path='/admins/new' element={<CreateAdmin />} />
                  <Route path='/admin/courses' element={<AllCourses />} />
                  <Route path='/admin/courses/new' element={<NewCourse />} />
                  <Route
                    path='/admin/courses/payment'
                    element={<CoursePayment />}
                  />
                  <Route path='/admin/courses/:id' element={<UpdateCourse />} />
                  <Route path='/admin/students' element={<AllStudents />} />
                  <Route path='/admin/posts' element={<BlogPosts />} />
                  <Route path='/admin/posts/new' element={<NewPost />} />
                  <Route path='/admin/posts/:id' element={<UpdatePost />} />
                </Route>
              </Route>
            </Route>

            {/* Admin Public Routes */}
            <Route path='admin/signin' element={<AdminSignin />} />

            {/* Unauthorized */}
            <Route path='/unauthorized' element={<Unauthorized />} />

            {/* catch all */}
            <Route path='*' element={<Missing />} />
          </Routes>
        </StudentProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
