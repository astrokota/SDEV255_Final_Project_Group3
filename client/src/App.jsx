import { useState, useEffect } from 'react'
import './App.css'
import CoursesPage from './pages/CoursesPage'

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
  //Fetching single course
  const viewDetails = async (id) => {
  try {
    
    const response = await fetch(`/api/courses/${id}`);
    
    if (response.ok) {
      const data = await response.json();
      
      setSelectedCourse(data); 
    } else {
      console.error("Course not found on server");
    }
  } catch (error) {
    console.error("Error fetching fresh course details:", error);
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
        fetchCourses(); 
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
        {/* DETAILS VIEW  */}
        {selectedCourse ? (
          <div className="details-view">
            <h2>{selectedCourse.course_name}</h2>
            <div className="details-card">
              <p><strong>Code:</strong> {selectedCourse.course_number}</p>
              <p><strong>Subject:</strong> {selectedCourse.subject_area}</p>
              <p><strong>Credits:</strong> {selectedCourse.credits}</p>
              <p><strong>Info:</strong> {selectedCourse.description}</p>
              <button className="back-btn" onClick={() => setSelectedCourse(null)}>Back to List</button>
            </div>
          </div>
        ) : showForm ? (
          /* FORM MODE */
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
          <CoursesPage 
            courses={courses} 
            onView={viewDetails} 
            onEdit={startEdit} 
            onDelete={deleteCourse} 
          />
        )}
      </main>
    </div>
  );
}

export default App;