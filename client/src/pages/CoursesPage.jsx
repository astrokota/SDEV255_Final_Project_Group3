import React from 'react';
import CourseCard from '../components/CourseCard';

const CoursesPage = ({ courses, onView, onEdit, onDelete }) => {
  return (
    <div className="course-grid">
      {courses.length === 0 ? (
        <p>Connecting to database...</p>
      ) : (
        courses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onView={onView} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))
      )}
    </div>
  );
};

export default CoursesPage;