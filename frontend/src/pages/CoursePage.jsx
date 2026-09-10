import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", description: "", technologies: "" };

function CoursePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const getCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      technologies: form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        alert("Course updated successfully");
      } else {
        await api.post("/courses", payload);
        alert("Course added successfully");
      }
      resetForm();
      getCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const startEdit = (course) => {
    setEditingId(course._id);
    setForm({
      name: course.name,
      description: course.description || "",
      technologies: course.technologies?.join(", ") || "",
    });
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    try {
      await api.delete(`/courses/${id}`);
      getCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>AI Interview Platform</h1>
          <p>Course Management</p>
        </div>
        <div>
          <span>Welcome, {user?.name}</span>
          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <button style={styles.backBtn} onClick={() => navigate("/admin")}>
          &larr; Back to Dashboard
        </button>

        <section style={styles.section}>
          <h2>{editingId ? "Edit Course" : "Add Course"}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Course Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              placeholder="Technologies: React, Node, MongoDB"
              value={form.technologies}
              onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            />
            <button type="submit">{editingId ? "Save Changes" : "Add Course"}</button>
            {editingId && (
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section style={styles.section}>
          <h2>Courses ({courses.length})</h2>

          {loading ? (
            <p>Loading...</p>
          ) : courses.length === 0 ? (
            <p>No courses added yet.</p>
          ) : (
            courses.map((course) => (
              <div key={course._id} style={styles.listItem}>
                <div>
                  <h3>{course.name}</h3>
                  <p>{course.description}</p>
                  <small>{course.technologies?.join(", ")}</small>
                </div>
                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => startEdit(course)}>
                    Edit
                  </button>
                  <button style={styles.deleteBtn} onClick={() => deleteCourse(course._id)}>
                    Delete
                  </button>
                </div>
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
  backBtn: {
    marginBottom: "20px",
    padding: "8px 16px",
    background: "white",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
  },
  section: {
    background: "white",
    marginBottom: "30px",
    padding: "25px",
    borderRadius: "10px",
  },
  form: { display: "flex", gap: "10px", flexWrap: "wrap" },
  cancelBtn: { background: "#e5e7eb" },
  listItem: {
    borderBottom: "1px solid #ddd",
    padding: "15px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: { display: "flex", gap: "10px" },
  editBtn: {
    padding: "8px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "8px 16px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default CoursePage;
