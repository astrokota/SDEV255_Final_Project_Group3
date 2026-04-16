import { useState, useEffect } from 'react'
import './App.css'

function App() {
  
  const [courses, setCourses] = useState([]);        
  const [showForm, setShowForm] = useState(false);    
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [editingCourse, setEditingCourse] = useState(null);  

  // LOAD DATA ON STARTUP -
  useEffect(() => {
    fetchCourses();
  }, []);

  // Hits the /api/courses route 
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data); 
    } catch (error) {
      console.error("Error fetching database records:", error);
    }
  };

  // CREATE AND UPDATE (POST & PUT) 
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Convert Form data to JSON object for MySQL
    const courseData = {
      course_name: formData.get('course_name'),
      subject_area: formData.get('subject_area'),
      course_number: formData.get('course_number'),
      credits: parseInt(formData.get('credits')), 
      description: formData.get('description'),
      teacher_id: 1 
    };

    try {
      // Use PUT if we are editing an existing ID, otherwise use POST
      const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        fetchCourses();      // Reload list from DB
        setShowForm(false);   // Close  form
        setEditingCourse(null); 
      }
    } catch (error) {
      console.error("Connection failed during save:", error);
    }
  };

  // DELETE 
  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure? This removes it from MySQL forever.")) {
      try {
        await fetch(`/api/courses/${id}`, { method: 'DELETE' });
        fetchCourses(); // Refresh 
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  // --- NAVIGATION HELPERS ---
  const startEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
    setSelectedCourse(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  };

  // UI
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">College Courses Portal</div>
        <div className="nav-links">
          <button onClick={() => {setSelectedCourse(null); closeForm()}}>Home</button>
          <button onClick={() => {setShowForm(true); setSelectedCourse(null); setEditingCourse(null)}}>+ New Course</button>
        </div>
      </nav>

      <main className="content">
        {/* VIEW DETAILS MODE */}
        {selectedCourse ? (
          <div className="details-view">
            <h2>{selectedCourse.course_name}</h2>
            <div className="details-card">
              <p><strong>Code:</strong> {selectedCourse.course_number}</p>
              <p><strong>Subject:</strong> {selectedCourse.subject_area}</p>
              <p><strong>Credits:</strong> {selectedCourse.credits}</p>
              <p><strong>Info:</strong> {selectedCourse.description}</p>
              <button className="back-btn" onClick={() => setSelectedCourse(null)}>Back</button>
            </div>
          </div>
        ) : showForm ? (
          /* CREATE / EDIT FORM MODE */
          <form className="course-form" onSubmit={handleSaveCourse}>
            <h2>{editingCourse ? "Update Record" : "Add New Course"}</h2>
            
            <input name="course_name" defaultValue={editingCourse?.course_name} placeholder="Name" required />
            <input name="course_number" defaultValue={editingCourse?.course_number} placeholder="BIO101" required />
            <input name="subject_area" defaultValue={editingCourse?.subject_area} placeholder="Subject" required />
            <input name="credits" type="number" defaultValue={editingCourse?.credits} placeholder="Credits" required />
            <textarea name="description" defaultValue={editingCourse?.description} placeholder="Description" required></textarea>
            
            <div className="form-buttons">
              <button type="submit" className="save-btn">{editingCourse ? "Update" : "Save"}</button>
              <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
            </div>
          </form>
        ) : (
          /* GRID VIEW MODE */
          <div className="course-grid">
            {courses.length === 0 ? (
              <p>Connecting to database...</p>
            ) : (
              courses.map(course => (
                <div key={course.id} className="course-card">
                  <h3>{course.course_name}</h3>
                  <p className="subtitle">{course.subject_area} | {course.credits} Credits</p>
                  <div className="card-actions">
                    <button className="view-btn" onClick={() => setSelectedCourse(course)}>Details</button>
                    <button className="edit-btn" onClick={() => startEdit(course)}>Edit</button>
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