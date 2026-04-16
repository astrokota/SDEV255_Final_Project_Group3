import { useState } from 'react'
import './App.css'

function App() {
  // 1. DATA STORAGE
  const [courses, setCourses] = useState([]); 
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); 

  // 2. LOGIC: ADD COURSE
  const handleAddCourse = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newCourse = {
      id: Date.now(),
      name: formData.get('courseName'),
      subject: formData.get('subject'),
      credits: formData.get('credits'),
      description: formData.get('description'),
    };
    setCourses([...courses, newCourse]);
    setShowForm(false); 
  };

  // 3.  DELETE COURSE
  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  // 4. THE INTERFACE (Body)
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">College Courses Portal</div>
        <div className="nav-links">
          <button onClick={() => {setSelectedCourse(null); setShowForm(false)}}>Index</button>
          <button onClick={() => {setShowForm(true); setSelectedCourse(null)}}>+ Add Course</button>
        </div>
      </nav>

      <main className="content">
        {/* Course Details Page */}
        {selectedCourse ? (
          <div className="details-view">
            <h2>Course Details: {selectedCourse.name}</h2>
            <div className="details-card">
              <p><strong>Subject Area:</strong> {selectedCourse.subject}</p>
              <p><strong>Credits:</strong> {selectedCourse.credits}</p>
              <p><strong>Description:</strong> {selectedCourse.description}</p>
              <button className="back-btn" onClick={() => setSelectedCourse(null)}>Back to Index</button>
            </div>
          </div>
        ) : showForm ? (
          /* RAdd Course Page/Form */
          <form className="course-form" onSubmit={handleAddCourse}>
            <h2>Create New Course</h2>
            <input name="courseName" placeholder="Course Name" required />
            <input name="subject" placeholder="Subject (e.g. CS)" required />
            <input name="credits" type="number" placeholder="Credits" required />
            <textarea name="description" placeholder="Course Description" required></textarea>
            <button type="submit" className="save-btn">Save Course</button>
          </form>
        ) : (
          /* Index Page of All Courses */
          <div className="course-grid">
            {courses.length === 0 ? (
              <p className="empty-msg">No courses found. Add a course to build your index!</p>
            ) : (
              courses.map(course => (
                <div key={course.id} className="course-card">
                  <h3>{course.name}</h3>
                  <p className="subtitle">{course.subject} | {course.credits} Credits</p>
                  <div className="card-actions">
                    <button className="view-btn" onClick={() => setSelectedCourse(course)}>View Details</button>
                    <button className="delete-btn" onClick={() => deleteCourse(course.id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;