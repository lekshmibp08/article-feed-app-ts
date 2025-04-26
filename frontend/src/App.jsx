import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";


import HomePage from "./pages/HomePage";
import SignupForm from "./pages/SignupForm";
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage";
import CreateArticlePage from "./pages/CreateArticlePage";
import MyArticlesPage from "./pages/MyArticlesPage";
import EditArticlePage from "./pages/EditArticlePage";
import SettingsPage from "./pages/SettingsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return <>
  <Routes>
    <Route element={<PublicRoute/>}>
      <Route path='/' element={<HomePage />} />
      <Route path='/signup' element={<SignupForm />} />
      <Route path='/login' element={<LoginPage />} />
    </Route>
    <Route element={<ProtectedRoute/>}>
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path="/dashboard/create-article" element={<CreateArticlePage />} />
      <Route path="/dashboard/my-articles" element={<MyArticlesPage />} />
      <Route path="/dashboard/edit-article/:id" element={<EditArticlePage />} />
      <Route path="/dashboard/settings" element={<SettingsPage />} />
    </Route>


  </Routes>
  <ToastContainer position="top-center" autoClose={3000} />
  </>;
}

export default App;
