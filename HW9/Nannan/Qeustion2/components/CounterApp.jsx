import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { setValue } from '../store/counterSlice';
import HooksCounter from './HooksCounter';
import ConnectCounter from './ConnectCounter';

const STORAGE_KEY = 'counter-value';

const CounterApp = () => {
  const dispatch = useDispatch();
  const store = useStore();  

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached !== null) {
        const parsed = parseInt(cached, 10);
        if (!isNaN(parsed)) {
          dispatch(setValue(parsed));
        }
      }
    } catch (err) {
      console.error('Failed to read counter from localStorage:', err);
    }

    return () => {
      try {
        const finalValue = store.getState().counter.value;
        localStorage.setItem(STORAGE_KEY, String(finalValue));
      } catch (err) {
        console.error('Failed to save counter to localStorage:', err);
      }
    };
  }, [dispatch, store]);

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Redux Counter</h1>
      <HooksCounter />
      <ConnectCounter />
    </div>
  );
};

export default CounterApp;
