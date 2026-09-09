const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getPendingInterns = async (req, res) => {

    try {

        const interns =
            await User.find({
                role: "intern",
                isApproved: false
            }).select("-password");

        res.json(interns);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const approveIntern = async (req, res) => {

    try {

        const intern =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    isApproved: true
                },
                {
                    new: true
                }
            ).select("-password");

        if (!intern) {

            return res.status(404).json({
                message: "Intern not found"
            });

        }

        res.json({

            message: "Intern approved successfully",

            intern

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const addFaculty = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            department
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });

        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const faculty = await User.create({

            name,
            email,

            password: hashedPassword,

            department,

            role: "faculty",

            isApproved: true // faculty added by admin don't need approval

        });

        const { password: _, ...facultyData } = faculty.toObject();

        res.status(201).json({

            message: "Faculty added successfully",

            faculty: facultyData

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Get all faculty members
const getFaculty = async (req, res) => {

    try {

        const faculty =
            await User.find({
                role: "faculty"
            }).select("-password");

        res.json(faculty);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Edit a faculty member
const updateFaculty = async (req, res) => {

    try {

        const {
            name,
            email,
            department
        } = req.body;

        const faculty =
            await User.findOne({
                _id: req.params.id,
                role: "faculty"
            });

        if (!faculty) {

            return res.status(404).json({
                message: "Faculty not found"
            });

        }

        if (email && email !== faculty.email) {

            const existingUser =
                await User.findOne({ email });

            if (existingUser) {

                return res.status(400).json({
                    message: "Email already in use"
                });

            }

        }

        const updated =
            await User.findByIdAndUpdate(
                req.params.id,
                {
                    ...(name && { name }),
                    ...(email && { email }),
                    ...(department && { department })
                },
                {
                    new: true,
                    runValidators: true
                }
            ).select("-password");

        res.json({

            message: "Faculty updated successfully",

            faculty: updated

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// Delete a faculty member
const deleteFaculty = async (req, res) => {

    try {

        const faculty =
            await User.findOneAndDelete({
                _id: req.params.id,
                role: "faculty"
            });

        if (!faculty) {

            return res.status(404).json({
                message: "Faculty not found"
            });

        }

        res.json({
            message: "Faculty deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


module.exports = {
    getPendingInterns,
    approveIntern,
    addFaculty,
    getFaculty,
    updateFaculty,
    deleteFaculty
};