import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const LEVELS = ["beginner", "intermediate", "advanced"];
const TYPE_LABELS = {
  mcq: "Multiple Choice (1 mark each, 20 total)",
  twomark: "Two Mark Questions (10 total)",
  practical: "Practical Questions (5 marks each, 5 total)",
};

const emptyForm = {
  type: "mcq",
  questionText: "",
  options: ["", "", "", ""],
  answer: "",
};

function FacultyQuestions() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [level, setLevel] = useState("beginner");
  const [questions, setQuestions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [qRes, sRes] = await Promise.all([
        api.get(`/faculty/questions/${courseId}/${level}`),
        api.get(`/faculty/questions/${courseId}/${level}/summary`),
      ]);
      setQuestions(qRes.data);
      setSummary(sRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, courseId]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleTypeChange = (type) => {
    setForm({
      type,
      questionText: "",
      options: type === "mcq" ? ["", "", "", ""] : [],
      answer: "",
    });
    setEditingId(null);
  };

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      course: courseId,
      level,
      type: form.type,
      questionText: form.questionText,
      answer: form.answer,
      ...(form.type === "mcq" && {
        options: form.options.filter((o) => o.trim() !== ""),
      }),
    };

    try {
      if (editingId) {
        await api.put(`/faculty/questions/${editingId}`, payload);
        alert("Question updated successfully");
      } else {
        await api.post("/faculty/questions", payload);
        alert("Question added successfully");
      }
      resetForm();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const startEdit = (q) => {
    setEditingId(q._id);
    setForm({
      type: q.type,
      questionText: q.questionText,
      options: q.type === "mcq" ? q.options : [],
      answer: q.answer,
    });
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await api.delete(`/faculty/questions/${id}`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const grouped = {
    mcq: questions.filter((q) => q.type === "mcq"),
    twomark: questions.filter((q) => q.type === "twomark"),
    practical: questions.filter((q) => q.type === "practical"),
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>AI Interview Platform</h1>
          <p>Manage Questions</p>
        </div>
        <div>
          <span>Welcome, {user?.name}</span>
          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <button style={styles.backBtn} onClick={() => navigate("/faculty")}>
          &larr; Back to Dashboard
        </button>

        {/* Level tabs */}
        <div style={styles.tabRow}>
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              style={level === lvl ? styles.tabActive : styles.tab}
              onClick={() => setLevel(lvl)}
            >
              {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
            </button>
          ))}
        </div>

        {/* Progress summary */}
        {summary && (
          <div style={styles.summaryRow}>
            <div style={styles.summaryCard}>
              MCQ: {summary.mcq.added}/{summary.mcq.required}
            </div>
            <div style={styles.summaryCard}>
              Two Mark: {summary.twomark.added}/{summary.twomark.required}
            </div>
            <div style={styles.summaryCard}>
              Practical: {summary.practical.added}/{summary.practical.required}
            </div>
            <div
              style={{
                ...styles.summaryCard,
                background: summary.isComplete ? "#dcfce7" : "#fef3c7",
              }}
            >
              {summary.isComplete ? "Session Complete" : "Session Incomplete"}
            </div>
          </div>
        )}

        {/* Add / Edit form */}
        <section style={styles.section}>
          <h2>{editingId ? "Edit Question" : "Add Question"}</h2>

          <div style={styles.typeRow}>
            {Object.keys(TYPE_LABELS).map((t) => (
              <button
                key={t}
                type="button"
                style={form.type === t ? styles.typeActive : styles.typeBtn}
                onClick={() => handleTypeChange(t)}
                disabled={!!editingId}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <textarea
              placeholder="Question text"
              value={form.questionText}
              onChange={(e) => setForm({ ...form, questionText: e.target.value })}
              style={styles.textarea}
              required
            />

            {form.type === "mcq" && (
              <div style={styles.optionsGrid}>
                {form.options.map((opt, i) => (
                  <input
                    key={i}
                    placeholder={`Option ${i + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    required
                  />
                ))}
              </div>
            )}

            {form.type === "mcq" ? (
              <select
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                required
              >
                <option value="">Select correct answer</option>
                {form.options
                  .filter((o) => o.trim() !== "")
                  .map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
              </select>
            ) : (
              <textarea
                placeholder="Answer / answer snippet"
                value={form.answer}
                onChange={(e) => setForm({ ...form, answer: e.target.value })}
                style={styles.textarea}
                required
              />
            )}

            <div style={styles.formActions}>
              <button type="submit">{editingId ? "Save Changes" : "Add Question"}</button>
              {editingId && (
                <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Question lists */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          Object.entries(grouped).map(([type, list]) => (
            <section key={type} style={styles.section}>
              <h2>{TYPE_LABELS[type]}</h2>
              {list.length === 0 ? (
                <p>No questions added yet.</p>
              ) : (
                list.map((q, idx) => (
                  <div key={q._id} style={styles.listItem}>
                    <div>
                      <strong>
                        {idx + 1}. {q.questionText}
                      </strong>
                      {q.type === "mcq" && (
                        <ul>
                          {q.options.map((opt, i) => (
                            <li
                              key={i}
                              style={opt === q.answer ? styles.correctOption : {}}
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                      )}
                      {q.type !== "mcq" && <p style={styles.answerText}>Answer: {q.answer}</p>}
                      <small>{q.marks} mark(s)</small>
                    </div>
                    <div style={styles.actions}>
                      <button style={styles.editBtn} onClick={() => startEdit(q)}>
                        Edit
                      </button>
                      <button style={styles.deleteBtn} onClick={() => deleteQuestion(q._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </section>
          ))
        )}
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
  tabRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  tab: {
    padding: "10px 18px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  tabActive: {
    padding: "10px 18px",
    background: "#4338ca",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  summaryRow: { display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" },
  summaryCard: {
    background: "white",
    padding: "12px 18px",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    fontWeight: 500,
  },
  section: {
    background: "white",
    marginBottom: "25px",
    padding: "25px",
    borderRadius: "10px",
  },
  typeRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "15px" },
  typeBtn: {
    padding: "8px 14px",
    background: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  typeActive: {
    padding: "8px 14px",
    background: "#eef2ff",
    border: "1px solid #4338ca",
    color: "#4338ca",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  textarea: { minHeight: "70px", padding: "10px", fontFamily: "inherit" },
  optionsGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" },
  formActions: { display: "flex", gap: "10px" },
  cancelBtn: { background: "#e5e7eb" },
  listItem: {
    borderBottom: "1px solid #ddd",
    padding: "15px 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  correctOption: { color: "#16a34a", fontWeight: 600 },
  answerText: { color: "#374151" },
  actions: { display: "flex", gap: "10px", flexShrink: 0 },
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

export default FacultyQuestions;