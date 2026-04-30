import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const MySchedulePage = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // 1. Fetch the Student's specific schedule
  const fetchMySchedule = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/enrollments/my-schedule`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEnrolledCourses(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchMySchedule();
  }, [token]);

  // 2. Drop a course (DELETE /enrollments/:courseId)
  const handleDrop = async (courseId) => {
    
    if (!window.confirm("Are you sure you want to drop this course?")) return;

    try {
      const response = await fetch(`${API_URL}/api/enrollments/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Course successfully dropped from your schedule.");
        fetchMySchedule(); 
      } else {
        alert("Failed to drop course.");
      }
    } catch (error) {
      console.error('Error dropping course:', error);
    }
  };

  if (loading) return <div className="loader">Loading your schedule...</div>;

  return (
    <div className="schedule-container">
      <header className="page-header">
        <h2>My Schedule</h2>
        <p>You are currently enrolled in {enrolledCourses.length} courses.</p>
      </header>

      {enrolledCourses.length === 0 ? (
        <div className="empty-state">
          <p>Your schedule is empty. Go to 'All Courses' to enroll!</p>
        </div>
      ) : (
        <div className="course-grid">
          {enrolledCourses.map(item => (
            <div key={item.id} className="course-card">
              {/* Logic: Check if details are nested in 'Course' or 'courses' object */}
              <h3>{item.Course?.course_name || item.course?.course_name || item.course_name}</h3>
              
              <p className="subtitle">
                {item.Course?.subject_area || item.course?.subject_area || item.subject_area} | 
                {item.Course?.credits || item.course?.credits || item.credits} Credits
              </p>
              
              <p className="description">
                {item.Course?.description || item.course?.description || item.description}
              </p>

              <div className="card-actions">
                <button 
                  className="delete-btn" 
                  
                  onClick={() => handleDrop(item.id)}
                >
                  Drop Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySchedulePage;