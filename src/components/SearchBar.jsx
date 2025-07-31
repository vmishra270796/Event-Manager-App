// src/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../assets/styles/SearchBar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const SearchBar = ({ events }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("events", events);

    const filtered = events.find((ev) => {
      const matchesName = name
        ? ev.name.toLowerCase().includes(name.toLowerCase())
        : true;

      const eventDate = new Date(ev.event_date).toLocaleDateString("en-CA");

      const matchesDate = date ? eventDate === date : true;
      console.log("Compare", eventDate, "==", date, "=>", matchesDate);

      return matchesName && matchesDate;
    });

    if (filtered) {
      navigate(`/events/${filtered._id}`);
    } else {
      alert("No matching event found.");
    }
  };

  console.log(date, "date ");

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button type="submit">Search</button>
      {userInfo && (
        <div className="btn-ctr">
          <Link to="/add">
            <button className="event-btn">Add Event</button>
          </Link>
          <button className="event-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
