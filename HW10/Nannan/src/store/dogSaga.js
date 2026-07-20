import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchRandomDog } from '../api/dogApi';
import {
  fetchDogRequest,
  fetchDogSuccess,
  fetchDogFailure,
} from './dogSlice';

// Worker saga: 处理一次 fetch
export function* fetchDogWorker() {
  try {
    const response = yield call(fetchRandomDog);
    if (response.data.status !== 'success') {
      throw new Error('API returned non-success status');
    }
    yield put(fetchDogSuccess(response.data.message));
  } catch (error) {
    yield put(fetchDogFailure(error.message));
  }
}

// Watcher saga: 监听 action
export function* dogSaga() {
  yield takeLatest(fetchDogRequest.type, fetchDogWorker);
}
