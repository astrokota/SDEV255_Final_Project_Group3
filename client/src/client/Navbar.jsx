import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/courses">Courses</Link>
      <Link to="/courses/add">Add Course</Link>
      <Link to="/schedule">My Schedule</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}