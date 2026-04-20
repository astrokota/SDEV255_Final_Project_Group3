import { useEffect, useState } from 'react';
import CourseCard from './components/CourseCard';
import CoursesPage from './pages/CoursesPage';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
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

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/courses`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchCourseById = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/courses/${id}`);
      const data = await response.json();
      setSelectedCourse(data);
      setView('details');
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingCourse ? 'PUT' : 'POST';
      const url = editingCourse
        ? `${API_URL}/api/courses/${editingCourse.id}`
        : `${API_URL}/api/courses`;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          credits: Number(formData.credits),
          teacher_id: 1, // temporary (Stage 1)
        }),
      });

      setFormData({
        course_name: '',
        subject_area: '',
        course_number: '',
        credits: '',
        description: '',
      });
      setEditingCourse(null);
      setView('list');
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
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

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/courses/${id}`, {
        method: 'DELETE',
      });
      fetchCourses();
      if (selectedCourse && selectedCourse.id === id) {
        setSelectedCourse(null);
        setView('list');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const renderForm = () => (
    <div className="form-container">
      <h2>{editingCourse ? 'Edit Course' : 'Add Course'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="course_name"
          placeholder="Course Name"
          value={formData.course_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject_area"
          placeholder="Subject Area"
          value={formData.subject_area}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="course_number"
          placeholder="Course Number"
          value={formData.course_number}
          onChange={handleChange}
        />
        <input
          type="number"
          name="credits"
          placeholder="Credits"
          value={formData.credits}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Course Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editingCourse ? 'Update Course' : 'Add Course'}
        </button>
        <button
          type="button"
          onClick={() => {
            setView('list');
            setEditingCourse(null);
            setFormData({
              course_name: '',
              subject_area: '',
              course_number: '',
              credits: '',
              description: '',
            });
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );

  const renderDetails = () => (
    <div className="details-container">
      <h2>{selectedCourse.course_name}</h2>
      <p><strong>Subject Area:</strong> {selectedCourse.subject_area}</p>
      <p><strong>Course Number:</strong> {selectedCourse.course_number || 'N/A'}</p>
      <p><strong>Credits:</strong> {selectedCourse.credits}</p>
      <p><strong>Description:</strong> {selectedCourse.description}</p>

      <button onClick={() => handleEdit(selectedCourse)}>Edit</button>
      <button onClick={() => handleDelete(selectedCourse.id)}>Delete</button>
      <button onClick={() => setView('list')}>Back to Courses</button>
    </div>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Course Registration System</h1>
        <div>
          <button onClick={() => setView('list')}>All Courses</button>
          <button
            onClick={() => {
              setEditingCourse(null);
              setFormData({
                course_name: '',
                subject_area: '',
                course_number: '',
                credits: '',
                description: '',
              });
              setView('form');
            }}
          >
            Add Course
          </button>
        </div>
      </nav>

      {view === 'list' && (
        <CoursesPage
          courses={courses}
          onDetails={fetchCourseById}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {view === 'form' && renderForm()}
      {view === 'details' && selectedCourse && renderDetails()}
    </div>
  );
}

export default App;