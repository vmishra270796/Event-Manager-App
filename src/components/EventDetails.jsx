// src/components/EventDetails.jsx
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/styles/EventDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById } from "../redux/eventSlice";
import { base_URL } from "../api/eventAPI";

const EventDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { event, loading, error } = useSelector((state) => ({
    event: state.events.list.find((e) => e._id === id),
    loading: state.events.loading,
    error: state.events.error,
  }));

  console.log(event, "in details");
  useEffect(() => {
    if (id && !event && !loading) {
      dispatch(fetchEventById(id));
    }
  }, [id, event, loading, dispatch]);

  if (loading && !event) {
    return <p>Loading event details...</p>;
  }
  if (error && !event) {
    return <p>Error: Could not load event. It may not exist.</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }
  const attendees = (() => {
    try {
      const parsed = JSON.parse(event.attendees);
      return Array.isArray(parsed)
        ? parsed
            .map((a) => (a?.Name ? `${a.Name} (${a.Mobile})` : a))
            .join(", ")
        : "";
    } catch {
      return "";
    }
  })();

  return (
    <div className="event-detail-container">
      <button className="back-button" onClick={() => navigate("/events")}>
        ⬅ Back to Events
      </button>
      <h2 className="title">{event?.name}</h2>
      <p className="detail">
        <strong>Date:</strong>{" "}
        {new Date(event?.event_date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
      <p className="detail">
        <strong>Type:</strong> {event?.event_type}
      </p>
      <p className="detail">
        <strong>Web Link:</strong>{" "}
        <a href={event?.web_link} target="_blank" rel="noreferrer">
          {event?.web_link}
        </a>
      </p>
      <p className="detail">
        <strong>Attendees:</strong> {attendees}
      </p>

      <div className="media-preview">
        {event?.event_type === "image" && event.file_path && (
          <img
            src={`${base_URL}/${event.file_path.replace(/\\/g, "/")}`}
            alt={event.name}
          />
        )}
        {event?.event_type === "video" && event?.file_path && (
          <video width="100%" controls>
            <source
              src={`${base_URL}/${event.file_path.replace(/\\/g, "/")}`}
              type="video/mp4"
            />
          </video>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
