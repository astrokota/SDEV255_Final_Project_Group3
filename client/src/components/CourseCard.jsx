const CourseCard = ({ course, onDetails, onEdit, onDelete, onEnroll, userRole }) => {
  return (
    <div className="course-card">
      <h3>{course.course_name}</h3>
      <p className="subtitle">{course.subject_area} | {course.credits} Credits</p>
      
      <div className="card-actions">
        
        <button className="view-btn" onClick={() => onDetails(course.id)}>
          View Details
        </button>

        {userRole === 'student' && (
          
          <button className="edit-btn" onClick={() => onEnroll(course.id)}>
            Add to My Schedule
          </button>
        )}

        {userRole === 'teacher' && (
          <>
            <button className="edit-btn" onClick={() => onEdit(course)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(course.id)}>Delete Course</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCard;