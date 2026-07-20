import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { call } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';

import { fetchDogWorker, dogSaga } from '../store/dogSaga';
import { fetchRandomDog } from '../api/dogApi';
import {
  fetchDogRequest,
  fetchDogSuccess,
  fetchDogFailure,
} from '../store/dogSlice';

describe('dogSaga', () => {
  const mockUrl = 'https://images.dog.ceo/test.jpg';
  const successResponse = { data: { message: mockUrl, status: 'success' } };
  const errorResponse = { data: { message: '', status: 'error' } };

  // --- Style 1: testSaga (step-by-step, tests exact effect order) ---
  describe('fetchDogWorker (step-by-step)', () => {
    it('handles successful fetch', () => {
      testSaga(fetchDogWorker)
        .next()
        .call(fetchRandomDog)
        .next(successResponse)
        .put(fetchDogSuccess(mockUrl))
        .next()
        .isDone();
    });

    it('handles non-success status as error', () => {
      testSaga(fetchDogWorker)
        .next()
        .call(fetchRandomDog)
        .next(errorResponse)
        .put(fetchDogFailure('API returned non-success status'))
        .next()
        .isDone();
    });

    it('handles network error', () => {
      const error = new Error('Network Error');
      testSaga(fetchDogWorker)
        .next()
        .call(fetchRandomDog)
        .throw(error)
        .put(fetchDogFailure('Network Error'))
        .next()
        .isDone();
    });
  });

  // --- Style 2: expectSaga (integration, tests final effects) ---
  describe('fetchDogWorker (integration)', () => {
    it('puts success action on API success', () => {
      return expectSaga(fetchDogWorker)
        .provide([[call(fetchRandomDog), successResponse]])
        .put(fetchDogSuccess(mockUrl))
        .run();
    });

    it('puts failure action on API error', () => {
      return expectSaga(fetchDogWorker)
        .provide([[call(fetchRandomDog), throwError(new Error('Network Error'))]])
        .put(fetchDogFailure('Network Error'))
        .run();
    });

    it('puts failure action when status is not success', () => {
      return expectSaga(fetchDogWorker)
        .provide([[call(fetchRandomDog), errorResponse]])
        .put(fetchDogFailure('API returned non-success status'))
        .run();
    });
  });

  // --- Watcher saga ---
  describe('dogSaga watcher', () => {
    it('triggers fetchDogWorker on fetchDogRequest action', () => {
      return expectSaga(dogSaga)
        .provide([[call(fetchRandomDog), successResponse]])
        .put(fetchDogSuccess(mockUrl))
        .dispatch(fetchDogRequest())
        .silentRun();
    });
  });
});
