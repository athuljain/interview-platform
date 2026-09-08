const User = require("../../models/User");

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

module.exports = {
    getPendingInterns,
    approveIntern
};