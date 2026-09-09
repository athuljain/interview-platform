import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", email: "", password: "", department: "" };

function FacultyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const getFaculty = async () => {
    try {
      const response = await api.get("/admin/faculty");
      setFaculty(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFaculty();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/faculty/${editingId}`, {
          name: form.name,
          email: form.email,
          department: form.department,
        });
        alert("Faculty updated successfully");
      } else {
        await api.post("/admin/faculty", form);
        alert("Faculty added successfully");
      }
      resetForm();
      getFaculty();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const startEdit = (member) => {
    setEditingId(member._id);
    setForm({
      name: member.name,
      email: member.email,
      password: "",
      department: member.department || "",
    });
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm("Delete this faculty member? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/faculty/${id}`);
      getFaculty();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>AI Interview Platform</h1>
          <p>Faculty Management</p>
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
          <h2>{editingId ? "Edit Faculty" : "Add Faculty"}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            {!editingId && (
              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            )}
            <input
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <button type="submit">{editingId ? "Save Changes" : "Add Faculty"}</button>
            {editingId && (
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel
              </button>
            )}
          </form>
        </section>

        <section style={styles.section}>
          <h2>Faculty ({faculty.length})</h2>

          {loading ? (
            <p>Loading...</p>
          ) : faculty.length === 0 ? (
            <p>No faculty added yet.</p>
          ) : (
            faculty.map((member) => (
              <div key={member._id} style={styles.listItem}>
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.email}</p>
                  <p>{member.department}</p>
                </div>
                <div style={styles.actions}>
                  <button style={styles.editBtn} onClick={() => startEdit(member)}>
                    Edit
                  </button>
                  <button style={styles.deleteBtn} onClick={() => deleteFaculty(member._id)}>
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

export default FacultyPage;
