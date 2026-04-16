USE course_registration;

INSERT INTO users (name, email, password, role) VALUES
('Professor Smith', 'smith@college.edu', 'test123', 'teacher'),
('Professor Johnson', 'johnson@college.edu', 'test123', 'teacher'),
('John Student', 'john@student.edu', 'test123', 'student'),
('Jane Student', 'jane@student.edu', 'test123', 'student');

INSERT INTO courses (course_name, description, subject_area, credits, course_number, teacher_id) VALUES
('Intro to Biology', 'Basic study of living organisms', 'Biology', 3, 'BIO101', 1),
('College Algebra', 'Fundamentals of algebra concepts', 'Mathematics', 3, 'MATH101', 1),
('English Composition', 'Writing and rhetoric fundamentals', 'English', 3, 'ENG101', 2),
('Introduction to Psychology', 'Survey of psychological principles and behavior', 'Psychology', 3, 'PSY101', 2);

INSERT INTO enrollments (student_id, course_id) VALUES
(3, 1),
(3, 2),
(4, 3);
