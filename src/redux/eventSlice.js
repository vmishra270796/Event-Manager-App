import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../api/eventAPI";

export const fetchEvents = createAsyncThunk(
  "events/fetch",
  async (_, { getState }) => {
    const { page } = getState().events;

    const res = await getEvents({ page });
    return res;
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchById",
  getEventById
);

export const addEvent = createAsyncThunk("events/add", createEvent);
export const editEvent = createAsyncThunk("events/edit", ({ id, data }) =>
  updateEvent(id, data)
);
export const removeEvent = createAsyncThunk(
  "events/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteEvent(id);
      return id; // <-- CRITICAL: Return the ID on success
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
  },
  reducers: {
    resetEvents: (state) => {
      state.list = [];
      state.page = 1;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        const newEvents = action.payload;

        if (newEvents.length < 10) {
          state.hasMore = false;
        }

        const existingIds = new Set(state.list.map((e) => e._id));
        const filteredNewEvents = newEvents.filter(
          (e) => !existingIds.has(e._id)
        );
        state.list.push(...filteredNewEvents);
        state.page += 1;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(editEvent.fulfilled, (state, action) => {
        const updatedEvent = action.payload;
        const index = state.list.findIndex(
          (event) => event._id === updatedEvent._id
        );
        if (index !== -1) {
          state.list[index] = updatedEvent;
        }
      })
      .addCase(removeEvent.fulfilled, (state, action) => {
        const deletedEventId = action.payload;
        state.list = state.list.filter((event) => event._id !== deletedEventId);
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        const fetchedEvent = action.payload;
        const exists = state.list.some(
          (event) => event._id === fetchedEvent._id
        );
        if (!exists) {
          state.list.push(fetchedEvent);
        }
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
