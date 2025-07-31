
import { Routes, Route } from "react-router-dom";
import AllEvents from "./components/AllEvents";
import EventForm from "./components/AddEvent";
import EventDetails from "./components/EventDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />{" "}

        {/* Protected Routes */}
        <Route path="" element={<PrivateRoute />}>
          <Route path="/events" element={<AllEvents />} />
          <Route path="/add" element={<EventForm />} />
          <Route path="/edit/:id" element={<EventForm />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/" element={<AllEvents />} /> {/* Default to events */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;

