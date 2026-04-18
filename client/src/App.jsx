import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import CourseDetails from "./pages/CourseDetails";
import EditCourse from "./pages/EditCourse";
import Login from "./pages/Login";
import MySchedule from "./pages/MySchedule";export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/add" element={<AddCourse />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/courses/:id/edit" element={<EditCourse />} />
        <Route path="/login" element={<Login />} />
        <Route path="/schedule" element={<MySchedule />} />
      </Routes>
    </BrowserRouter>
  );
}