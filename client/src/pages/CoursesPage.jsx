import React from 'react';
import CourseCard from '../components/CourseCard';

const CoursesPage = ({ courses, onDetails, onEdit, onDelete, onEnroll, userRole }) => {
  return (
    <div className="course-grid">
      {courses.length === 0 ? (
        <p>No courses available at this time.</p>
      ) : (
        courses.map(course => (
          <CourseCard 
            key={course.id} 
            course={course} 
            onDetails={onDetails} 
            onEdit={onEdit} 
            onDelete={onDelete}
            onEnroll={onEnroll}      
            userRole={userRole}    
          />
        ))
      )}
    </div>
  );
};


export default CoursesPage;