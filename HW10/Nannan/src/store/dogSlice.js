import { createSlice } from '@reduxjs/toolkit';

const dogSlice = createSlice({
  name: 'dog',
  initialState: {
    imageUrl: '',
    loading: false,
    error: null,
  },
  reducers: {
    // Saga 会监听这个 action
    fetchDogRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDogSuccess: (state, action) => {
      state.loading = false;
      state.imageUrl = action.payload;
    },
    fetchDogFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchDogRequest, fetchDogSuccess, fetchDogFailure } = dogSlice.actions;
export default dogSlice.reducer;
