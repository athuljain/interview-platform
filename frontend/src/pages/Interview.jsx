import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";
function Interview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("courseId");
  const level = searchParams.get("level");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/questions/interview", {
          params: { courseId, level },
        });
        setQuestions(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId && level) {
      loadQuestions();
    }
  }, [courseId, level]);
  const handleAnswer = (questionId, answer) => {
    setAnswers((previous) => ({ ...previous, [questionId]: answer }));
  };
  const submitInterview = async () => {
    try {
      const formattedAnswers = questions.map((question) => ({
        questionId: question._id,
        answer: answers[question._id] || "",
      }));
      const response = await api.post("/interviews/submit", {
        courseId,
        level,
        answers: formattedAnswers,
      });
      navigate("/result", { state: response.data.result });
    } catch (error) {
      alert(error.response?.data?.message || "Interview submission failed");
    }
  };
  if (loading) {
    return <h2> Loading questions... </h2>;
  }
  return (
    <div style={styles.container}>
      {" "}
      <div style={styles.header}>
        {" "}
        <h1> {level?.toUpperCase()} Interview </h1>{" "}
        <p> Answer all questions </p>{" "}
      </div>{" "}
      <div style={styles.questions}>
        {" "}
        {questions.length === 0 ? (
          <h2> No questions available </h2>
        ) : (
          questions.map((question, index) => (
            <div key={question._id} style={styles.question}>
              {" "}
              <h3>
                {" "}
                {index + 1}. {question.question}{" "}
              </h3>{" "}
              <p> Type: {question.type} </p>{" "}
              {question.options && question.options.length > 0 ? (
                <div>
                  {" "}
                  {question.options.map((option) => (
                    <label key={option} style={styles.option}>
                      {" "}
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={() => handleAnswer(question._id, option)}
                      />{" "}
                      <span> {option} </span>{" "}
                    </label>
                  ))}{" "}
                </div>
              ) : (
                <textarea
                  rows="5"
                  placeholder="Enter your answer..."
                  value={answers[question._id] || ""}
                  onChange={(e) => handleAnswer(question._id, e.target.value)}
                />
              )}{" "}
            </div>
          ))
        )}{" "}
        {questions.length > 0 && (
          <button style={styles.submit} onClick={submitInterview}>
            {" "}
            Submit Interview{" "}
          </button>
        )}{" "}
      </div>{" "}
    </div>
  );
}
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    paddingBottom: "50px",
  },
  header: { background: "#111827", color: "white", padding: "30px 40px" },
  questions: { maxWidth: "900px", margin: "30px auto" },
  question: {
    background: "white",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  option: { display: "block", padding: "10px", cursor: "pointer" },
  submit: { padding: "15px 30px", cursor: "pointer", fontSize: "16px" },
};
export default Interview;
