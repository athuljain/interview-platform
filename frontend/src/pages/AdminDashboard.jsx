import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [interns, setInterns] = useState([]);
  const [courseCount, setCourseCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);

  // Get pending interns
  const getPendingInterns = async () => {
    try {
      const response = await api.get("/admin/pending-interns");
      setInterns(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Get course count
  const getCourseCount = async () => {
    try {
      const response = await api.get("/courses");
      setCourseCount(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  // Get faculty count
  const getFacultyCount = async () => {
    try {
      const response = await api.get("/admin/faculty");
      setFacultyCount(response.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  // Get interview count (falls back to 0 if endpoint doesn't support this yet)
  const getInterviewCount = async () => {
    try {
      const response = await api.get("/interviews");
      setInterviewCount(Array.isArray(response.data) ? response.data.length : 0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPendingInterns();
    getCourseCount();
    getFacultyCount();
    getInterviewCount();
  }, []);

  // Approve intern
  const approveIntern = async (id) => {
    try {
      await api.put(`/admin/approve-intern/${id}`);
      alert("Intern approved successfully");
      getPendingInterns();
    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>AI Interview Platform</h1>
          <p>Admin Dashboard</p>
        </div>
        <div>
          <span>Welcome, {user?.name}</span>
          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* Statistics */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Pending Interns</h3>
            <h1>{interns.length}</h1>
          </div>
          <div
            style={{ ...styles.card, ...styles.clickableCard }}
            onClick={() => navigate("/admin/courses")}
          >
            <h3>Total Courses</h3>
            <h1>{courseCount}</h1>
            <small>Click to manage &rarr;</small>
          </div>
          <div
            style={{ ...styles.card, ...styles.clickableCard }}
            onClick={() => navigate("/admin/faculty")}
          >
            <h3>Faculty</h3>
            <h1>{facultyCount}</h1>
            <small>Click to manage &rarr;</small>
          </div>
          <div style={styles.card}>
            <h3>Interviews</h3>
            <h1>{interviewCount}</h1>
          </div>
        </div>

        {/* Quick navigation */}
        <div style={styles.navRow}>
          <button style={styles.navBtn} onClick={() => navigate("/admin/courses")}>
            Manage Courses
          </button>
          <button style={styles.navBtn} onClick={() => navigate("/admin/faculty")}>
            Manage Faculty
          </button>
        </div>

        {/* Pending Interns */}
        <section style={styles.section}>
          <h2>Pending Intern Approvals</h2>
          {interns.length === 0 ? (
            <p>No pending interns.</p>
          ) : (
            interns.map((intern) => (
              <div key={intern._id} style={styles.listItem}>
                <div>
                  <strong>{intern.name}</strong>
                  <p>{intern.email}</p>
                  <p>{intern.department}</p>
                </div>
                <button onClick={() => approveIntern(intern._id)}>Approve</button>
              </div>
            ))
          )}
        </section>
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
  logout: { marginLeft: "20px", padding: "10px 18px", cursor: "pointer" },
  main: { padding: "30px 40px" },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  clickableCard: {
    cursor: "pointer",
    border: "1px solid #e0e7ff",
  },
  navRow: { marginTop: "20px", display: "flex", gap: "10px" },
  navBtn: {
    padding: "10px 20px",
    background: "#4338ca",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 500,
  },
  section: {
    background: "white",
    marginTop: "30px",
    padding: "25px",
    borderRadius: "10px",
  },
  listItem: {
    borderBottom: "1px solid #ddd",
    padding: "15px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default AdminDashboard;
