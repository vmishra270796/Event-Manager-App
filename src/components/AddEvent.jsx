import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import * as XLSX from "xlsx";
import '../assets/styles/AddEvent.css';
import { addEvent, editEvent } from "../redux/eventSlice";

const AddEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const selectedEvent = state?.event || null;

  const [form, setForm] = useState({
    id: selectedEvent?._id || null,
    name: selectedEvent?.name || "",
    date: selectedEvent?.event_date?.split("T")[0] || "",
    type: selectedEvent?.event_type || "image",
    file: null,
    excel: null,
    web_link: selectedEvent?.web_link || "",
  });
  const [errors, setErrors] = useState({});
  const [attendeesPreview, setAttendeesPreview] = useState([]);

  useEffect(() => {
    if (form.excel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const attendees = XLSX.utils.sheet_to_json(sheet);
        setAttendeesPreview(attendees);
      };
      reader.readAsArrayBuffer(form.excel);
    }
  }, [form.excel]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    console.log(files); 
    
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };


  const validateAndFormatURL = (urlString) => {
    if (!urlString || !urlString.trim()) return "";
    try {
      new URL(urlString);
      return urlString;
    } catch (_) {
      try {
        const correctedUrl = `https://${urlString}`;
        new URL(correctedUrl);
        return correctedUrl;
      } catch (_) {
        return null;
      }
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Event name is required.";
    if (!form.date) newErrors.date = "Event date is required.";
    if (!form.id && !form.file)
      newErrors.file = "An event file is required for new events.";
    if (form.web_link && validateAndFormatURL(form.web_link) === null) {
      newErrors.web_link = "Please enter a valid URL.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("event_date", form.date);
    formData.append("event_type", form.type);
    formData.append("web_link", validateAndFormatURL(form.web_link)); // Format URL before sending

    if (form.file) formData.append("eventFile", form.file);
    if (form.excel) formData.append("attendeeFile", form.excel);

    if (form.id) {
      await dispatch(editEvent({ id: form.id, data: formData }));
    } else {
      await dispatch(addEvent(formData));
    }

    navigate("/events");
  };



  return (
    <div className="container">
      <h2 className="heading">{form.id ? "Edit Event" : "Add Event"}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <label>Event Name:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className="row">
          <label>Event Date:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          {errors.date && <span className="error-text">{errors.date}</span>}
        </div>
        <div className="row">
          <label>Event Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="type"
                value="image"
                checked={form.type === "image"}
                onChange={handleChange}
              />{" "}
              Image
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="video"
                checked={form.type === "video"}
                onChange={handleChange}
              />{" "}
              Video
            </label>
          </div>
        </div>

        <div className="row">
          <label>Upload Event File:</label>
          <div className="file-upload">
            <div className="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-2"
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="">Upload Event File Here</div>

            <label htmlFor="eventFile">Select File</label>
            <input
              type="file"
              id="eventFile"
              name="file"
              accept="image/*,video/*"
              onChange={handleChange}
              placeholder="Upload Event File Here"
            />
            {selectedEvent?.file_path && !form.file && (
              <p className="info">
                Current File: {selectedEvent.file_path.split(/[\/\\]/).pop()}
              </p>
            )}
            <div>
             {form?.file?.name}
            </div>
          </div>
        </div>

        <div className="row">
          <label>Upload Attendee List Excel:</label>
          <div className="file-upload">
            <div className="icon">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-2"
              >
                <path
                  fillRule="evenodd"
                  d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="">Upload Attendee List Excel</div>

            <label htmlFor="attendeeFile">Select File </label>
            <input
              type="file"
              id="attendeeFile"
              name="excel"
              accept=".xls,.xlsx,.csv"
              onChange={handleChange}
            />
          </div>
        </div>
        {attendeesPreview.length > 0 && (
          <div className="row">
            <label>Attendees Preview:</label>
            <ul>
              {attendeesPreview.map((a, idx) => (
                <li key={idx}>
                  {a.Name} - {a.Mobile}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="row">
          <label>Event Web Link:</label>
          <input
            type="text"
            name="web_link"
            value={form.web_link}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
          {errors.web_link && (
            <span className="error-text">{errors.web_link}</span>
          )}
        </div>
        <div className="row">
          <button type="submit">
            {form.id ? "Update Event" : "Add Event"}
          </button>
        </div>
      </form>
      <p className="link" onClick={() => navigate("/events")}>
        View All Events
      </p>
    </div>
  );
};

export default AddEvent;
