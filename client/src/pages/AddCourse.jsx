import { useEffect, useState } from "react";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  return (
    <div>
      <h1>Courses</h1>

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}