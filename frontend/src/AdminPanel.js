import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const API = "http://localhost:5000/api";

function AdminPanel() {
  const [tab, setTab] = useState("dashboard");
  const [faqs, setFaqs] = useState([]);
  const [notices, setNotices] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [search, setSearch] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqType, setFaqType] = useState("General");
  const [editingFAQ, setEditingFAQ] = useState(null);

  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDesc, setNoticeDesc] = useState("");
  const [noticeType, setNoticeType] = useState("General");
  const [noticeFile, setNoticeFile] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);

  const [timeTitle, setTimeTitle] = useState("");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [timeFile, setTimeFile] = useState(null);
  const [editingTime, setEditingTime] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all data
  const fetchAll = async () => {
    try {
      const [f, n, t] = await Promise.all([
        axios.get(`${API}/faqs`),
        axios.get(`${API}/notices`),
        axios.get(`${API}/timetables`),
      ]);
      setFaqs(f.data);
      setNotices(n.data);
      setTimetables(t.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ============ FAQ CRUD ============
  const saveFAQ = async () => {
    if (!question || !answer) return alert("Please fill all fields");
    try {
      if (editingFAQ) {
        await axios.put(
          `${API}/faqs/${editingFAQ}`,
          { question, answer, type: faqType },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API}/faqs`,
          { question, answer, type: faqType },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setQuestion("");
      setAnswer("");
      setFaqType("General");
      setEditingFAQ(null);
      fetchAll();
    } catch (err) {
      console.error("FAQ error:", err);
    }
  };

  const deleteFAQ = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;
    await axios.delete(`${API}/faqs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAll();
  };

  // ============ NOTICE CRUD ============
  const saveNotice = async () => {
    if (!noticeTitle || !noticeDesc) return alert("Fill all fields");
    try {
      const form = new FormData();
      form.append("title", noticeTitle);
      form.append("description", noticeDesc);
      form.append("type", noticeType);
      if (noticeFile) form.append("file", noticeFile);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (editingNotice) {
        await axios.put(`${API}/notices/${editingNotice}`, form, { headers });
      } else {
        await axios.post(`${API}/notices`, form, { headers });
      }

      setNoticeTitle("");
      setNoticeDesc("");
      setNoticeType("General");
      setNoticeFile(null);
      setEditingNotice(null);
      fetchAll();
    } catch (err) {
      console.error("Notice error:", err);
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    await axios.delete(`${API}/notices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAll();
  };

  // ============ TIMETABLE CRUD ============
  const saveTimetable = async () => {
    if (!timeTitle || !branch || !semester) return alert("Fill all fields");
    try {
      const form = new FormData();
      form.append("title", timeTitle);
      form.append("course", course);
      form.append("branch", branch);
      form.append("semester", semester);
      if (timeFile) form.append("file", timeFile);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (editingTime) {
        await axios.put(`${API}/timetables/${editingTime}`, form, { headers });
      } else {
        await axios.post(`${API}/timetables`, form, { headers });
      }

      setTimeTitle("");
      setCourse("");
      setBranch("");
      setSemester("");
      setTimeFile(null);
      setEditingTime(null);
      fetchAll();
    } catch (err) {
      console.error("Timetable error:", err);
    }
  };

  const deleteTimetable = async (id) => {
    if (!window.confirm("Delete this timetable?")) return;
    await axios.delete(`${API}/timetables/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAll();
  };

  // ============ Filters ============
  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      (f.type || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.type || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredTimetables = timetables.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.branch || "").toLowerCase().includes(search.toLowerCase())
  );

  // ============ Render ============
  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="tabs">
        <button onClick={() => setTab("dashboard")}>📊 Dashboard</button>
        <button onClick={() => setTab("faqs")}>📘 FAQs</button>
        <button onClick={() => setTab("notices")}>📢 Notices</button>
        <button onClick={() => setTab("timetables")}>📅 Timetables</button>
      </div>

      {tab === "dashboard" && (
        <div>
          <h3>Overview</h3>
          <p>Total FAQs: {faqs.length}</p>
          <p>Total Notices: {notices.length}</p>
          <p>Total Timetables: {timetables.length}</p>
        </div>
      )}

      {tab === "faqs" && (
        <div>
          <h3>{editingFAQ ? "Edit FAQ" : "Add FAQ"}</h3>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Question"
          />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer"
          ></textarea>
          <select
            value={faqType}
            onChange={(e) => setFaqType(e.target.value)}
            style={{ marginBottom: "8px" }}
          >
            <option>General</option>
            <option>Exam</option>
            <option>Admission</option>
            <option>Hostel</option>
            <option>Fees</option>
          </select>
          <button onClick={saveFAQ}>
            {editingFAQ ? "Update FAQ" : "Add FAQ"}
          </button>
          <input
            placeholder="Filter by type or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginTop: "10px", width: "60%" }}
          />
          <ul>
            {filteredFaqs.map((f) => (
              <li key={f._id}>
                <b>Q:</b> {f.question}
                <br />
                <b>A:</b> {f.answer}
                <br />
                <i>{f.type}</i>
                <br />
                <small>
                  Created: {new Date(f.createdAt).toLocaleString()} | Updated:{" "}
                  {new Date(f.updatedAt).toLocaleString()}
                </small>
                <br />
                <button onClick={() => {
                  setEditingFAQ(f._id);
                  setQuestion(f.question);
                  setAnswer(f.answer);
                  setFaqType(f.type);
                }}>Edit</button>
                <button onClick={() => deleteFAQ(f._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "notices" && (
        <div>
          <h3>{editingNotice ? "Edit Notice" : "Add Notice"}</h3>
          <input
            value={noticeTitle}
            onChange={(e) => setNoticeTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={noticeDesc}
            onChange={(e) => setNoticeDesc(e.target.value)}
            placeholder="Description"
          ></textarea>
          <select
            value={noticeType}
            onChange={(e) => setNoticeType(e.target.value)}
          >
            <option>General</option>
            <option>Exam</option>
            <option>Event</option>
            <option>Fee</option>
          </select>
          <input type="file" onChange={(e) => setNoticeFile(e.target.files[0])} />
          <button onClick={saveNotice}>
            {editingNotice ? "Update Notice" : "Add Notice"}
          </button>
          <input
            placeholder="Filter by type or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginTop: "10px", width: "60%" }}
          />
          <ul>
            {filteredNotices.map((n) => (
              <li key={n._id}>
                <b>{n.title}</b> - {n.description}
                <br />
                <i>{n.type}</i>
                <br />
                <small>
                  Created: {new Date(n.createdAt).toLocaleString()} | Updated:{" "}
                  {new Date(n.updatedAt).toLocaleString()}
                </small>
                <br />
                {n.fileUrl && (
                  <a
                    href={`http://localhost:5000${n.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 View File
                  </a>
                )}
                <br />
                <button
                  onClick={() => {
                    setEditingNotice(n._id);
                    setNoticeTitle(n.title);
                    setNoticeDesc(n.description);
                    setNoticeType(n.type);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteNotice(n._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "timetables" && (
        <div>
          <h3>{editingTime ? "Edit Timetable" : "Add Timetable"}</h3>
          <input
            value={timeTitle}
            onChange={(e) => setTimeTitle(e.target.value)}
            placeholder="Title"
          />
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Course (B.Tech, etc.)"
          />
          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Branch (CSE, ECE, etc.)"
          />
          <input
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            placeholder="Semester"
          />
          <input
            type="file"
            onChange={(e) => setTimeFile(e.target.files[0])}
          />
          <button onClick={saveTimetable}>
            {editingTime ? "Update Timetable" : "Add Timetable"}
          </button>
          <input
            placeholder="Filter by branch or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginTop: "10px", width: "60%" }}
          />
          <ul>
            {filteredTimetables.map((t) => (
              <li key={t._id}>
                <b>{t.title}</b> - {t.course} / {t.branch} / {t.semester}
                <br />
                <small>
                  Created: {new Date(t.createdAt).toLocaleString()} | Updated:{" "}
                  {new Date(t.updatedAt).toLocaleString()}
                </small>
                <br />
                {t.fileUrl && (
                  <a
                    href={`http://localhost:5000${t.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 View File
                  </a>
                )}
                <br />
                <button
                  onClick={() => {
                    setEditingTime(t._id);
                    setTimeTitle(t.title);
                    setCourse(t.course);
                    setBranch(t.branch);
                    setSemester(t.semester);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteTimetable(t._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
