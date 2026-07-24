// src/Counter.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, setCount } from './store/counterSlice';

export function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // 1.  Read from localStorage at Mounting Phase
  useEffect(() => {
    const cachedValue = localStorage.getItem('cached_counter');
    if (cachedValue !== null) {
      dispatch(setCount(Number(cachedValue)));
    }
  }, [dispatch]);

  // 2. Write to localStorage whenever count changes
  useEffect(() => {
    localStorage.setItem('cached_counter', count);
  }, [count]);

  return (
    <div className="p-4 text-center">
      <h2>Counter: {count}</h2>
      <div className="flex gap-2 justify-center">
        <button onClick={() => dispatch(decrement())} className="px-3 py-1 bg-gray-500 text-white rounded">-1</button>
        <button onClick={() => dispatch(increment())} className="px-3 py-1 bg-blue-500 text-white rounded">+1</button>
      </div>
    </div>
  );
}