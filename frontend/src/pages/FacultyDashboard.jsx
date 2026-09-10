import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function FacultyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses();
  }, []);

  const getCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>AI Interview Platform</h1>
          <p>Faculty Dashboard</p>
        </div>
        <div>
          Welcome, {user?.name}
          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <h2>My Courses</h2>
        <div style={styles.grid}>
          {courses.map((course) => (
            <div key={course._id} style={styles.course}>
              <h2>{course.name}</h2>
              <p>{course.description}</p>
              <p>
                <strong>Technologies: </strong>
                {course.technologies?.join(", ")}
              </p>
              <button
                style={styles.manageBtn}
                onClick={() => navigate(`/faculty/questions/${course._id}`)}
              >
                Manage Interview Questions
              </button>
            </div>
          ))}
        </div>
      </main>
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
  logout: { marginLeft: "20px", padding: "10px 18px" },
  main: { padding: "40px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  course: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  manageBtn: {
    marginTop: "15px",
    padding: "10px 16px",
    background: "#4338ca",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
  },
};

export default FacultyDashboard;