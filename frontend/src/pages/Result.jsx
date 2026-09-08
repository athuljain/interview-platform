import { useLocation, useNavigate } from "react-router-dom";
function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;
  if (!result) {
    return (
      <div style={styles.container}>
        {" "}
        <h1> No Result Found </h1>{" "}
        <button onClick={() => navigate("/intern")}>
          {" "}
          Back to Dashboard{" "}
        </button>{" "}
      </div>
    );
  }
  const passed = result.percentage >= 50;
  return (
    <div style={styles.container}>
      {" "}
      <div style={styles.resultCard}>
        {" "}
        <h1> Interview Completed </h1> <p> Your interview result </p>{" "}
        <div style={styles.score}> {result.percentage}% </div>{" "}
        <h2> {passed ? "PASSED" : "FAILED"} </h2>{" "}
        <div style={styles.details}>
          {" "}
          <div>
            {" "}
            <strong> Total Questions </strong>{" "}
            <span> {result.totalQuestions} </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <strong> Correct Answers </strong>{" "}
            <span> {result.correctAnswers} </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <strong> Score </strong> <span> {result.score} </span>{" "}
          </div>{" "}
          <div>
            {" "}
            <strong> Level </strong> <span> {result.level} </span>{" "}
          </div>{" "}
        </div>{" "}
        <button style={styles.button} onClick={() => navigate("/intern")}>
          {" "}
          Back to Dashboard{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  resultCard: {
    background: "white",
    padding: "50px",
    width: "500px",
    textAlign: "center",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  score: { fontSize: "60px", fontWeight: "bold", margin: "30px 0" },
  details: { marginTop: "30px", textAlign: "left" },
  detailsDiv: { display: "flex", justifyContent: "space-between" },
  button: { marginTop: "30px", padding: "12px 25px", cursor: "pointer" },
};
export default Result;
