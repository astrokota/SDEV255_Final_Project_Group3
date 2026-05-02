import React, { useState } from 'react';
import CourseCard from '../components/CourseCard';

const CoursesPage = ({ courses, onDetails, onEdit, onDelete, onEnroll, userRole, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    onSearch(value); 
  };

  return (
    <div className="courses-page">
      {/* ---  SEARCH --- */}
      <div className="search-bar-container" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
      </div>

      <div className="course-grid">
        {courses.length === 0 ? (
          <p>No courses found.</p>
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
    </div>
  );
};

export default CoursesPage;