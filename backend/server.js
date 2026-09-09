require("dotenv").config();

const express = require("express");

const cors = require("cors");

const connectDB =
    require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const courseRoutes =
    require("./routes/courseRoutes");

const questionRoutes =
    require("./routes/questionRoutes");

const interviewRoutes =
    require("./routes/interviewRoutes");

const adminRoutes=require("./routes/adminRoutes")   
const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/courses",
    courseRoutes
);

app.use(
    "/api/questions",
    questionRoutes
);

app.use(
    "/api/interviews",
    interviewRoutes
);
app.use("/api/admin",adminRoutes)

app.get("/", (req, res) => {

    res.json({
        message:
            "AI Interview Platform API"
    });

});

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);