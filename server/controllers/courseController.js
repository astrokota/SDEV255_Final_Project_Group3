const db = require('../config/db');

function isNonEmptyString(value) {
    return typeof value === "string" && value.trim().length > 0;
}

function parsePositiveInt(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) return null;
    return n;
}

function validateCoursePayload(body) {
    const errors = {};

    if (!isNonEmptyString(body.course_name)) errors.course_name = "course_name is required";
    if (!isNonEmptyString(body.description)) errors.description = "description is required";
    if (!isNonEmptyString(body.subject_area)) errors.subject_area = "subject_area is required";

    const credits = parsePositiveInt(body.credits);
    if (credits === null) errors.credits = "credits must be a positive integer";

    return { ok: Object.keys(errors).length === 0, errors, credits };
}

// Get all courses
const getAllCourses = (req, res) => {
    const sql = "SELECT * FROM courses";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching courses:", err);
            return res.status(500).json({ error: "Failed to fetch courses" });
        }

        res.status(200).json(results);
    });
};

// Get one course by ID
const getCourseById = (req, res) => {
    const {id} = req.params;
    const courseId = parsePositiveInt(id);
    if (courseId === null) {
        return res.status(400).json({ error: "Invalid course id" });
    }
    const sql = "SELECT * FROM courses WHERE id = ?";

    db.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error("Error fetching course:", err);
            return res.status(500).json({ error: "Failed to fetch course" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json(results[0]);
    });
};

//POST create new course
const createCourse = (req, res) => {
    const {
        course_name,
        description,
        subject_area,
        credits,
        course_number,
        teacher_id,
    } = req.body;

    const validation = validateCoursePayload(req.body);
    if (!validation.ok) {
        return res.status(400).json({
            error: "Invalid course data",
            fields: validation.errors,
        });
    }

    const sql = "INSERT INTO courses (course_name, description, subject_area, credits, course_number, teacher_id) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(
        sql,
        [
            course_name.trim(),
            description.trim(),
            subject_area.trim(),
            validation.credits,
            course_number || null,
            teacher_id || null,
        ],
        (err, results) => {
            if (err) {
                console.error("Error creating course:", err);
                return res.status(500).json({ error: "Failed to create course" });
            }
            
            res.status(201).json({ message: "Course created successfully", courseId: results.insertId });
        }
    );
};

//PUT update course
const updateCourse = (req, res) => {
    const {id} = req.params;
    const courseId = parsePositiveInt(id);
    if (courseId === null) {
        return res.status(400).json({ error: "Invalid course id" });
    }
    const {
        course_name,
        description,
        subject_area,
        credits,
        course_number,
    } = req.body;

    const validation = validateCoursePayload(req.body);
    if (!validation.ok) {
        return res.status(400).json({
            error: "Invalid course data",
            fields: validation.errors,
        });
    }

    const sql = "UPDATE courses SET course_name = ?, description = ?, subject_area = ?, credits = ?, course_number = ? WHERE id = ?";

    db.query(
        sql,
        [
            course_name.trim(),
            description.trim(),
            subject_area.trim(),
            validation.credits,
            course_number || null,
            courseId,
        ],
        (err, results) => {
            if (err) {
                console.error("Error updating course:", err);
                return res.status(500).json({ error: "Failed to update course" });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Course not found" });
            }

            res.status(200).json({ message: "Course updated successfully" });
        }
    );
};

//DELETE course
const deleteCourse = (req, res) => {
    const {id} = req.params;
    const courseId = parsePositiveInt(id);
    if (courseId === null) {
        return res.status(400).json({ error: "Invalid course id" });
    }
    const sql = "DELETE FROM courses WHERE id = ?";

    db.query(sql, [courseId], (err, results) => {
        if (err) {
            console.error("Error deleting course:", err);
            return res.status(500).json({ error: "Failed to delete course" });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted successfully" });
    });
};


module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};