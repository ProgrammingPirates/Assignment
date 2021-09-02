//This displays the pdf and slider component



import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { Container } from "react-bootstrap";
import { createUser } from "../api";
import DiscreteSlider from "./Slider";
import {
  upDateStudentPoints,
  getAssignments,
  createAssignment,
  getFile,
} from "../api";
import "./TeacherForm.css";
import LeftDrawer from "./LeftDrawer";
import PDFView from "./pdfView";

export default function TeacherForm(props) {
  const remarkRef = useRef();
  const history = useHistory();
  const { currentUser, signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [studentName, setStudentName] = useState("");
  const [assiName, setAssiName] = useState("");
  const [pdfURL, setPdfURL] = useState("");

  const [points, setPoints] = useState({
    timePoints: 0,
    correctPoints: 0,
    neatPoints: 0,
  });

  const getFileURL = async ({ studname, assigname }) => {
    let url = await getFile({ email: studname, assiName: assigname });
    console.log("url in teacher form", url);
    setPdfURL(url);
  };

  useEffect(() => {
    const assigName = props.match.params.assignmentName;
    // studentName =  studentEmail
    const studName = props.match.params.studentName;
    setStudentName(studName);
    setAssiName(assigName);
    getFileURL({ studname: studName, assigname: assigName });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    upDateStudentPoints({
      email: studentName,
      points: timePoints + correctPoints + neatPoints,
      remark: remarkRef.current.value,
      assiName: assiName,
    });
    history.push("/TeacherAssignments");
  }

  const { timePoints, correctPoints, neatPoints } = points;

  const handleSliders = (sliderName) => {
    return (slidePoints) => {
      setPoints({ ...points, [sliderName]: slidePoints });
    };
  };

  return (
    <>
      <div>
        <LeftDrawer />
      </div>

      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "85vh" }}
      >
        <div className="row">
          <div
            style={{
              border: "1px solid rgba(0, 0, 0, 0.3)",
              height: "750px",
              width: "100%",
              maxWidth: "1000px",
            }}
          >
            <PDFView url={pdfURL} />
          </div>

          <div className="w-100" style={{ maxWidth: "1000px" }}>
            <Card className="styles.card_teacher" bsPrefix="card_teacher">
              <Card.Body>
                <h2 className="text-center mb-4">Assignment Score</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group id="timePoints">
                    <DiscreteSlider
                      name="Time Score"
                      handleSlider={handleSliders("timePoints")}
                    />
                    <h2>{JSON.stringify(timePoints)}</h2>
                    {/* <h2>{studentName}</h2>
                  <h2>{assiName}</h2> */}
                  </Form.Group>

                  <Form.Group
                    id="neatnessPoints"
                    style={{ alignContent: "center", alignItems: "center" }}
                  >
                    <DiscreteSlider
                      name="Neatness Score"
                      handleSlider={handleSliders("neatPoints")}
                    />
                    <h2>{JSON.stringify(neatPoints)}</h2>
                  </Form.Group>

                  <Form.Group id="correctnessPoints">
                    <DiscreteSlider
                      name="Correctness Points"
                      handleSlider={handleSliders("correctPoints")}
                    />
                    <h2>{JSON.stringify(correctPoints)}</h2>
                    {/* <h2>{JSON.stringify(points)}</h2> */}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control as="textarea" rows={3} ref={remarkRef} />
                  </Form.Group>

                  <Button
                    disabled={loading}
                    onClick={handleSubmit}
                    className="w-100"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}
