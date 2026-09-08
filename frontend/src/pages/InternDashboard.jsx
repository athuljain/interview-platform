import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
function InternDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await api.get("/courses");
        setCourses(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCourses();
  }, []);
  const startInterview = (level) => {
    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }
    navigate(`/interview?courseId=${selectedCourse._id}&level=${level}`);
  };
  return (
    <div style={styles.container}>
      {" "}
      <header style={styles.header}>
        {" "}
        <div>
          {" "}
          <h1> AI Interview Platform </h1> <p> Intern Dashboard </p>{" "}
        </div>{" "}
        <div>
          {" "}
          Welcome, {user?.name}{" "}
          <button style={styles.logout} onClick={logout}>
            {" "}
            Logout{" "}
          </button>{" "}
        </div>{" "}
      </header>{" "}
      <main style={styles.main}>
        {" "}
        <h2> Select Your Course </h2>{" "}
        <div style={styles.courseGrid}>
          {" "}
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => setSelectedCourse(course)}
              style={{
                ...styles.course,
                border:
                  selectedCourse?._id === course._id
                    ? "3px solid #2563eb"
                    : "1px solid #ddd",
              }}
            >
              {" "}
              <h2> {course.name} </h2> <p> {course.description} </p>{" "}
              <p> {course.technologies?.join(", ")} </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
        {selectedCourse && (
          <section style={styles.levelSection}>
            {" "}
            <h2> {selectedCourse.name} </h2> <p> Select Interview Level </p>{" "}
            <div style={styles.levelGrid}>
              {" "}
              <button
                style={styles.levelButton}
                onClick={() => startInterview("beginner")}
              >
                {" "}
                <h3> Beginner </h3> <span> Basic concepts </span>{" "}
              </button>{" "}
              <button
                style={styles.levelButton}
                onClick={() => startInterview("intermediate")}
              >
                {" "}
                <h3> Intermediate </h3>{" "}
                <span> Intermediate concepts </span>{" "}
              </button>{" "}
              <button
                style={styles.levelButton}
                onClick={() => startInterview("advanced")}
              >
                {" "}
                <h3> Advanced </h3> <span> Advanced concepts </span>{" "}
              </button>{" "}
            </div>{" "}
          </section>
        )}{" "}
      </main>{" "}
    </div>
  );
}
const styles = {
  container: { minHeight: "100vh", background: "#f5f7fb" },
  header: {
    background: "#111827",
    color: "white",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logout: { marginLeft: "20px", padding: "10px 18px", cursor: "pointer" },
  main: { padding: "40px" },
  courseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  course: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    cursor: "pointer",
  },
  levelSection: {
    background: "white",
    padding: "30px",
    marginTop: "30px",
    borderRadius: "12px",
  },
  levelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
  },
  levelButton: {
    padding: "25px",
    cursor: "pointer",
    background: "#f9fafb",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },
};
export default InternDashboard;
