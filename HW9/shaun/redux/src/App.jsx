import { useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { decrement, increment, setValue } from "./counterSlice";

function App(props) {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  const countRef = useRef(count);

  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const cachedValue = localStorage.getItem("counterValue");

    if (cachedValue !== null) {
      dispatch(setValue(Number(cachedValue)));
    }

    return () => {
      localStorage.setItem("counterValue", countRef.current);
    };
  }, [dispatch]);

  return (
    <div className="app">
      <h1>Redux Counter</h1>

      <h2>{count}</h2>

      <div className="section">
        <h3>Using mapDispatchToProps</h3>

        <button onClick={props.incrementByProps}>Increment</button>
        <button onClick={props.decrementByProps}>Decrement</button>
      </div>

      <div className="section">
        <h3>Using useDispatch</h3>

        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    incrementByProps: () => dispatch(increment()),
    decrementByProps: () => dispatch(decrement()),
  };
};

export default connect(null, mapDispatchToProps)(App);