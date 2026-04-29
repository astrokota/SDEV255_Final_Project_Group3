const express = require("express");
const router = express.Router();

const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.post("/", verifyToken, requireRole("teacher"), createCourse);
router.put("/:id", verifyToken, requireRole("teacher"), updateCourse);
router.delete("/:id", verifyToken, requireRole("teacher"), deleteCourse);

module.exports = router;