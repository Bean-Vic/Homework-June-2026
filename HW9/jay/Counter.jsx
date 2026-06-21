import { connect, useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from './store/counterSlice'
import './Counter.css'

function Counter({ incrementByConnect, decrementByConnect }) {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className="counter-card">
      <h1>Redux Counter</h1>
      <p className="count">{count}</p>

      <section>
        <h2>Buttons via <code>mapDispatchToProps</code></h2>
        <div className="row">
          <button onClick={decrementByConnect}>- decrement</button>
          <button onClick={incrementByConnect}>+ increment</button>
        </div>
      </section>

      <section>
        <h2>Buttons via <code>useDispatch</code></h2>
        <div className="row">
          <button onClick={() => dispatch(decrement())}>- decrement</button>
          <button onClick={() => dispatch(increment())}>+ increment</button>
        </div>
      </section>
    </div>
  )
}

const mapStateToProps = (state) => ({
  count: state.counter.value,
})

const mapDispatchToProps = (dispatch) => ({
  incrementByConnect: () => dispatch(increment()),
  decrementByConnect: () => dispatch(decrement()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
