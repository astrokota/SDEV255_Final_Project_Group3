import { useEffect, useState, useContext } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthContext } from './context/AuthContext'; 
import MySchedulePage from './pages/MySchedulePage';
import LoginPage from './pages/LoginPage';
import CoursesPage from './pages/CoursesPage';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const { token, logout, role } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    course_name: '',
    subject_area: '',
    course_number: '',
    credits: '',
    description: '',
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [view, setView] = useState('list');

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  useEffect(() => {
    if (token) {
      fetchCourses();
    }
  }, [token]);

  const fetchCourses = async (searchTerm = '') => {
  try {
    
    const url = searchTerm 
      ? `${API_URL}/api/courses?search=${encodeURIComponent(searchTerm)}`
      : `${API_URL}/api/courses`;

    const response = await fetch(url, { headers: getAuthHeaders() });
    const data = await response.json();
    setCourses(data);
  } catch (error) { 
    console.error('Error fetching courses:', error); 
  }
};

  const fetchCourseById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/courses/${id}`, { headers: getAuthHeaders() });
      const data = await response.json();
      setSelectedCourse(data);
      setView('details');
    } catch (error) { console.error('Error fetching course details:', error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isEditing = Boolean(editingCourse);
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `${API_URL}/api/courses/${editingCourse.id}` : `${API_URL}/api/courses`;

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(), 
        body: JSON.stringify({
          course_name: formData.course_name,
          subject_area: formData.subject_area,
          course_number: formData.course_number,
          credits: Number(formData.credits),
          description: formData.description
        }),
      });

      if (response.ok) {
        setFormData({ course_name: '', subject_area: '', course_number: '', credits: '', description: '' });
        setEditingCourse(null);
        setView('list');
        fetchCourses(); 
      } else {
        alert("Failed to save. Teachers only!");
      }
    } catch (error) { console.error('Submit error:', error); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(`${API_URL}/api/courses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(), 
      });
      if (response.ok) {
        fetchCourses();
        if (selectedCourse?.id === id) setView('list');
      }
    } catch (error) { console.error('Delete error:', error); }
  };

  const handleEdit = (course) => {
    setFormData({
      course_name: course.course_name || '',
      subject_area: course.subject_area || '',
      course_number: course.course_number || '',
      credits: course.credits || '',
      description: course.description || '',
    });
    setEditingCourse(course);
    setView('form');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch(`${API_URL}/api/enrollments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ course_id: courseId })
      });

      if (response.ok) {
        alert("Enrolled successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Enrollment failed.");
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };

  const renderForm = () => (
    <div className="form-container">
      <h2>{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="course_name" placeholder="Course Name" value={formData.course_name} onChange={handleChange} required />
        <input type="text" name="subject_area" placeholder="Subject Area" value={formData.subject_area} onChange={handleChange} required />
        <input type="text" name="course_number" placeholder="Course Number" value={formData.course_number} onChange={handleChange} />
        <input type="number" name="credits" placeholder="Credits" value={formData.credits} onChange={handleChange} required />
        <textarea name="description" placeholder="Course Description" value={formData.description} onChange={handleChange} required />
        <button type="submit">{editingCourse ? 'Update Course' : 'Add Course'}</button>
        <button type="button" onClick={() => setView('list')}>Cancel</button>
      </form>
    </div>
  );

  const renderDetails = () => (
    <div className="details-container">
      <h2>{selectedCourse.course_name}</h2>
      <p><strong>Subject Area:</strong> {selectedCourse.subject_area}</p>
      <p><strong>Credits:</strong> {selectedCourse.credits}</p>
      <p><strong>Description:</strong> {selectedCourse.description}</p>
      {role === 'teacher' && (
        <>
          <button onClick={() => handleEdit(selectedCourse)}>Edit</button>
          <button onClick={() => handleDelete(selectedCourse.id)}>Delete</button>
        </>
      )}
      <button onClick={() => setView('list')}>Back</button>
    </div>
  );

  return (
    <BrowserRouter basename="/SDEV255_Final_Project_Group3">
      <nav className="navbar">
  <h1>Course Registration</h1>
  <div>
    {token ? (
      <>
        
        <span className="user-role-label">Role: {role}</span>

        <button onClick={() => setView('list')}>All Courses</button>
        
        {role === 'student' && <button onClick={() => setView('schedule')}>My Schedule</button>}
        
        {role === 'teacher' && (
          <button onClick={() => {
            setEditingCourse(null);
            setFormData({ course_name: '', subject_area: '', course_number: '', credits: '', description: '' });
            setView('form');
          }}>
            Add Course to Catalog
          </button>
        )}
        <button onClick={logout}>Logout</button>
      </>
    ) : null}
  </div>
</nav>

      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/" element={token ? (
          <>
            {view === 'list' && (
              <CoursesPage 
                courses={courses} 
                onDetails={fetchCourseById} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onEnroll={handleEnroll} 
                onSearch={fetchCourses}
                userRole={role} 
              />
            )}
            {view === 'schedule' && <MySchedulePage />}
            {view === 'form' && renderForm()}
            {view === 'details' && selectedCourse && renderDetails()}
          </>
        ) : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;