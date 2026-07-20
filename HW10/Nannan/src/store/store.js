import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import dogReducer from './dogSlice';
import { dogSaga } from './dogSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    dog: dogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(dogSaga);
