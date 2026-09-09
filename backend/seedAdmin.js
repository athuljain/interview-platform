
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
 
const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123"; // change before running, or read from env
 
const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
 
        const existing = await User.findOne({ email: ADMIN_EMAIL });
 
        if (existing) {
            console.log("Admin already exists:", ADMIN_EMAIL);
            process.exit(0);
        }
 
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
 
        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            isApproved: true // admins don't need approval
        });
 
        console.log("Admin created successfully:");
        console.log({ id: admin._id, email: admin.email, role: admin.role });
 
        process.exit(0);
 
    } catch (error) {
        console.error("Error seeding admin:", error.message);
        process.exit(1);
    }
};
 
seedAdmin();