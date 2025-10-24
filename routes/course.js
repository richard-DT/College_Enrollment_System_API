const express = require("express");
const courseController = require("../controllers/course");

const auth = require("../auth");
const { verify, verifyAdmin } = auth;


const router = express.Router();


router.post("/", verify, verifyAdmin, courseController.addCourse);


router.get("/all", verify, verifyAdmin, courseController.getAllCourses); 


router.get("/", courseController.getAllActive);

router.get("/specific/:id", courseController.getCourse);

router.patch("/:courseId", verify, verifyAdmin, courseController.updateCourse);

router.patch("/:courseId/archive", verify, verifyAdmin, courseController.archiveCourse);

router.patch("/:courseId/activate", verify, verifyAdmin, courseController.activateCourse);


module.exports = router;