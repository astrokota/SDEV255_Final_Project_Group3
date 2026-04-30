const CourseCard = ({ course, onDetails, onEdit, onDelete, onEnroll, userRole }) => {
  return (
    <div className="course-card">
      <h3>{course.course_name}</h3>
      <p>{course.subject_area} | {course.credits} Credits</p>
      
      <div className="card-actions">
  <button onClick={() => onDetails(course.id)}>View Details</button>

  {/* Only shows if userRole is exactly 'student' */}
  {userRole === 'student' && (
    <button className="enroll-btn" onClick={() => onEnroll(course.id)}>
      Add to My Schedule
    </button>
  )}

  {/* Only shows if userRole is exactly 'teacher' */}
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