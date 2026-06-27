import { useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { increment, decrement, setValue } from "./counterSlice";
import "./ReduxCounter.css";

const STORAGE_KEY = "redux-counter-value";

function HookButtons() {
  const dispatch = useDispatch();

  return (
    <div className="button-group">
      <button onClick={() => dispatch(increment())}>
        Increment with useDispatch
      </button>

      <button onClick={() => dispatch(decrement())}>
        Decrement with useDispatch
      </button>
    </div>
  );
}

function ReduxCounter({
  count,
  incrementByProps,
  decrementByProps,
  setCachedValue,
}) {
  const latestCount = useRef(count);

  useEffect(() => {
    latestCount.current = count;
  }, [count]);

  useEffect(() => {
    const savedValue = localStorage.getItem(STORAGE_KEY);

    if (savedValue !== null) {
      setCachedValue(Number(savedValue));
    }

    return () => {
      localStorage.setItem(STORAGE_KEY, String(latestCount.current));
    };
  }, [setCachedValue]);

  return (
    <main className="counter-page">
      <section className="counter-card">
        <h1>Redux Counter</h1>

        <p className="counter-value">{count}</p>

        <h3>Buttons using mapDispatchToProps</h3>
        <div className="button-group">
          <button onClick={incrementByProps}>Increment</button>
          <button onClick={decrementByProps}>Decrement</button>
        </div>

        <h3>Buttons using useDispatch</h3>
        <HookButtons />

        <p className="note">The counter value is managed by Redux store.</p>
      </section>
    </main>
  );
}

const mapStateToProps = (state) => {
  return {
    count: state.counter.value,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    incrementByProps: () => dispatch(increment()),
    decrementByProps: () => dispatch(decrement()),
    setCachedValue: (value) => dispatch(setValue(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReduxCounter);
