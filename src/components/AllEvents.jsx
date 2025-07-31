import React, { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEvents, removeEvent, resetEvents } from "../redux/eventSlice";
import "../assets/styles/AllEvents.css";

import SearchBar from "./SearchBar";

const AllEvents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    list: events,
    loading,
    hasMore,
  } = useSelector((state) => state.events);

  console.log(events, "events");
  const observer = useRef();

  useEffect(() => {
    dispatch(resetEvents());

    dispatch(fetchEvents());

    return () => {
      dispatch(resetEvents());
    };
  }, [dispatch]);

  const lastEventRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchEvents());
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, dispatch]
  );

  const handleEdit = (event) =>
    navigate(`/edit/${event._id}`, { state: { event } });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(removeEvent(id));
    }
  };

  const parseAttendees = (attendees) => {
    try {
      const parsed =
        typeof attendees === "string" ? JSON.parse(attendees) : attendees;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="events-container">
      <div className="serch-bar">
        <h2 className="heading">All Events</h2>
        <SearchBar events={events} />
      </div>
      <div className="events-grid">
        {events.map((event, idx) => (
          <div
            className="event-card"
            key={event._id}
            ref={idx === events.length - 1 ? lastEventRef : null}
          >
            <div className="thumbnail">
              {event.event_type === "image" && event.file_path && (
                <img
                  src={`http://localhost:5000/${event.file_path.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt={event.name}
                  loading="lazy"
                />
              )}
              {event.event_type === "video" && event.file_path && (
                <video width="100%" controls>
                  <source
                    src={`http://localhost:5000/${event.file_path.replace(
                      /\\/g,
                      "/"
                    )}`}
                    type="video/mp4"
                  />
                </video>
              )}
            </div>
            <h3>Event Name : {event.name}</h3>
            <p>
              {new Date(event.event_date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              {" | "}
              Attendees{" "}
              {parseAttendees(event.attendees)
                .map((a) => (a?.Name ? a.Name : a))
                .join(", ")}
            </p>
            <div className="card-buttons">
              <button onClick={() => handleEdit(event)}>Edit</button>
              <button
                className="delete"
                onClick={() => handleDelete(event._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading more events...</p>}
      {!hasMore && (
        <p style={{ textAlign: "center" }}>No more events to load.</p>
      )}
    </div>
  );
};

export default AllEvents;
