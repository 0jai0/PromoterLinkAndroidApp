// contacts.actions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContacts } from '../contancts.api';

export const fetchContactsAction = createAsyncThunk(
  'contacts/fetchContacts',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await fetchContacts(userId);
      return Array.isArray(data) ? data : (data.collections || []);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch contacts");
    }
  }
);
