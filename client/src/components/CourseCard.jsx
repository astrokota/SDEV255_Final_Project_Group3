import React from 'react';

const CourseCard = ({ course, onView, onEdit, onDelete }) => {
  return (
    <div className="course-card">
      <h3>{course.course_name}</h3>
      <p className="subtitle">
        {course.subject_area} | {course.credits} Credits
      </p>
      <div className="card-actions">
      
        <button className="view-btn" onClick={() => onView(course.id)}>
          Details
        </button>
        <button className="edit-btn" onClick={() => onEdit(course)}>
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(course.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CourseCard;