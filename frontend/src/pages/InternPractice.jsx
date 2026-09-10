import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const LEVELS = ["beginner", "intermediate", "advanced"];

function InternPractice() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [level, setLevel] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const openLevel = async (course, lvl) => {
    setSelectedCourse(course);
    setLevel(lvl);
    setLoading(true);
    try {
      const response = await api.get(`/questions/${course._id}/${lvl}`);
      setData(response.data);
    } catch (error) {
      alert(error.response?.data?.message || "Could not load questions");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const backToLevels = () => {
    setLevel(null);
    setData(null);
  };

  const backToCourses = () => {
    setSelectedCourse(null);
    setLevel(null);
    setData(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1>AI Interview Platform</h1>
          <p>Practice Questions</p>
        </div>
        <div>
          <span>Welcome, {user?.name}</span>
          <button style={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <button style={styles.backBtn} onClick={() => navigate("/intern")}>
          &larr; Back to Dashboard
        </button>

        {/* Step 1: choose course */}
        {!selectedCourse && (
          <div style={styles.grid}>
            {courses.map((course) => (
              <div
                key={course._id}
                style={styles.card}
                onClick={() => setSelectedCourse(course)}
              >
                <h3>{course.name}</h3>
                <p>{course.description}</p>
                <small>{course.technologies?.join(", ")}</small>
              </div>
            ))}
          </div>
        )}

        {/* Step 2: choose level */}
        {selectedCourse && !level && (
          <>
            <button style={styles.backBtn} onClick={backToCourses}>
              &larr; Back to Courses
            </button>
            <h2>{selectedCourse.name} — choose a level</h2>
            <div style={styles.levelRow}>
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  style={styles.levelBtn}
                  onClick={() => openLevel(selectedCourse, lvl)}
                >
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Step 3: view questions with answers */}
        {selectedCourse && level && (
          <>
            <button style={styles.backBtn} onClick={backToLevels}>
              &larr; Back to Levels
            </button>
            <h2>
              {selectedCourse.name} — {level.charAt(0).toUpperCase() + level.slice(1)}
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : !data || data.totalQuestions === 0 ? (
              <p>No questions available for this level yet.</p>
            ) : (
              <>
                <p style={styles.meta}>
                  {data.totalQuestions} questions &middot; {data.totalMarks} total marks
                </p>

                {data.mcq.length > 0 && (
                  <section style={styles.section}>
                    <h3>Multiple Choice Questions</h3>
                    {data.mcq.map((q, i) => (
                      <div key={q._id} style={styles.qBlock}>
                        <p style={styles.qText}>
                          {i + 1}. {q.questionText}
                        </p>
                        <ul>
                          {q.options.map((opt, idx) => (
                            <li
                              key={idx}
                              style={opt === q.answer ? styles.correctOption : {}}
                            >
                              {opt}
                            </li>
                          ))}
                        </ul>
                        <p style={styles.answerLine}>Answer: {q.answer}</p>
                      </div>
                    ))}
                  </section>
                )}

                {data.twomark.length > 0 && (
                  <section style={styles.section}>
                    <h3>Two Mark Questions</h3>
                    {data.twomark.map((q, i) => (
                      <div key={q._id} style={styles.qBlock}>
                        <p style={styles.qText}>
                          {i + 1}. {q.questionText}
                        </p>
                        <p style={styles.answerLine}>Answer: {q.answer}</p>
                      </div>
                    ))}
                  </section>
                )}

                {data.practical.length > 0 && (
                  <section style={styles.section}>
                    <h3>Practical Questions</h3>
                    {data.practical.map((q, i) => (
                      <div key={q._id} style={styles.qBlock}>
                        <p style={styles.qText}>
                          {i + 1}. {q.questionText}
                        </p>
                        <pre style={styles.snippet}>{q.answer}</pre>
                      </div>
                    ))}
                  </section>
                )}
              </>
            )}
          </>
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
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    cursor: "pointer",
  },
  levelRow: { display: "flex", gap: "15px", marginTop: "15px" },
  levelBtn: {
    padding: "16px 30px",
    background: "#4338ca",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
  },
  meta: { color: "#6b7280", marginBottom: "20px" },
  section: {
    background: "white",
    marginBottom: "20px",
    padding: "25px",
    borderRadius: "10px",
  },
  qBlock: { marginBottom: "20px", paddingBottom: "15px", borderBottom: "1px solid #eee" },
  qText: { fontWeight: 600, marginBottom: "8px" },
  correctOption: { color: "#16a34a", fontWeight: 600 },
  answerLine: { color: "#2563eb", marginTop: "8px" },
  snippet: {
    background: "#111827",
    color: "#e5e7eb",
    padding: "14px",
    borderRadius: "6px",
    overflowX: "auto",
    fontSize: "13px",
  },
};

export default InternPractice;