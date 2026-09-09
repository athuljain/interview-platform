const express = require("express");

const {
    getPendingInterns,
    approveIntern,
    addFaculty,
    getFaculty,
    updateFaculty,
    deleteFaculty
} = require("../controllers/adminController");

const {
    authMiddleware,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// All admin routes require a valid token AND admin role
router.use(authMiddleware, authorize("admin"));

// Intern approval
router.get("/pending-interns", getPendingInterns);
router.put("/approve-intern/:id", approveIntern);
 
// Faculty management
router.post("/faculty", addFaculty);
router.get("/faculty", getFaculty);
router.put("/faculty/:id", updateFaculty);
router.delete("/faculty/:id", deleteFaculty);

module.exports = router;