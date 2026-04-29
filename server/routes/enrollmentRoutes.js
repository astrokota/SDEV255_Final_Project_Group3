const express = require("express");
const router = express.Router();

const {
  getMySchedule,
  addCourseToSchedule,
  dropCourseFromSchedule,
} = require("../controllers/enrollmentController");

const { verifyToken, requireRole } = require("../middleware/authMiddleware");

router.get("/my-schedule", verifyToken, requireRole("student"), getMySchedule);
router.post("/", verifyToken, requireRole("student"), addCourseToSchedule);
router.delete("/:courseId", verifyToken, requireRole("student"), dropCourseFromSchedule);

module.exports = router;