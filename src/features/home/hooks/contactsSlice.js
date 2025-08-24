// contacts.slice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchContactsAction } from './contacts.actions';

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetched: null,
    userId: null
  },
  reducers: {
    clearContacts: (state) => {
      state.items = [];
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactsAction.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.userId = action.meta.arg;
      })
      .addCase(fetchContactsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchContactsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearContacts } = contactsSlice.actions;
export default contactsSlice.reducer;