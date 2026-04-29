const db = require("../config/db");

const getMySchedule = (req, res) => {
  const studentId = req.user.id;

  const sql = `
    SELECT 
      courses.id,
      courses.course_name,
      courses.description,
      courses.subject_area,
      courses.credits,
      courses.course_number,
      courses.teacher_id,
      enrollments.id AS enrollment_id
    FROM enrollments
    JOIN courses ON enrollments.course_id = courses.id
    WHERE enrollments.student_id = ?
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      console.error("Error fetching schedule:", err);
      return res.status(500).json({ error: "Failed to fetch schedule" });
    }

    res.status(200).json(results);
  });
};

const addCourseToSchedule = (req, res) => {
  const studentId = req.user.id;
  const { course_id } = req.body;

  if (!course_id || Number.isNaN(Number(course_id))) {
    return res.status(400).json({ error: "Valid course_id is required." });
  }

  const sql = `
    INSERT INTO enrollments (student_id, course_id)
    VALUES (?, ?)
  `;

  db.query(sql, [studentId, course_id], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Student is already enrolled in this course." });
      }

      console.error("Error adding course to schedule:", err);
      return res.status(500).json({ error: "Failed to add course to schedule" });
    }

    res.status(201).json({
      message: "Course added to schedule",
      enrollmentId: result.insertId,
    });
  });
};

const dropCourseFromSchedule = (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  if (!courseId || Number.isNaN(Number(courseId))) {
    return res.status(400).json({ error: "Valid course id is required." });
  }

  const sql = `
    DELETE FROM enrollments
    WHERE student_id = ? AND course_id = ?
  `;

  db.query(sql, [studentId, courseId], (err, result) => {
    if (err) {
      console.error("Error dropping course:", err);
      return res.status(500).json({ error: "Failed to drop course" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Enrollment not found." });
    }

    res.status(200).json({ message: "Course dropped from schedule" });
  });
};

module.exports = {
  getMySchedule,
  addCourseToSchedule,
  dropCourseFromSchedule,
};