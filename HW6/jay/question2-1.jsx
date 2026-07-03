// HW6 - Coding Q1: Class Component Counter
//
// Requirements:
//   a. Passing in the initial value as props
//   b. The component should manage its own state
//   c. Render current state on the web page
//   d. Build 2 buttons to increase and decrease the shown value
//   e. Extra Credit: An HOC that reads/writes/updates the initial value
//      from localStorage so the value persists across page reloads
//   f. Bonus: Make it look pretty (styled with inline styles so the file
//      stays self-contained with no extra dependencies)

import { Component } from "react";

// ---------------------------------------------------------------------------
// (a)-(d) The class component
// ---------------------------------------------------------------------------
class Counter extends Component {
  constructor(props) {
    super(props);
    // (a) initial value comes in as a prop
    // (b) the component manages its own state
    this.state = { count: props.initialValue };
  }

  increase = () => {
    // Use the updater form so we always work off the latest state
    this.setState((prevState) => {
      const next = prevState.count + 1;
      // Let an optional parent/HOC know the value changed (extra credit)
      this.props.onChange?.(next);
      return { count: next };
    });
  };

  decrease = () => {
    this.setState((prevState) => {
      const next = prevState.count - 1;
      this.props.onChange?.(next);
      return { count: next };
    });
  };

  render() {
    return (
      <div style={styles.card}>
        <h2 style={styles.title}>Counter</h2>

        {/* (c) render current state on the web page */}
        <div style={styles.count}>{this.state.count}</div>

        {/* (d) two buttons to increase / decrease the shown value */}
        <div style={styles.buttonRow}>
          <button
            style={{ ...styles.button, ...styles.decreaseBtn }}
            onClick={this.decrease}
          >
            − Decrease
          </button>
          <button
            style={{ ...styles.button, ...styles.increaseBtn }}
            onClick={this.increase}
          >
            + Increase
          </button>
        </div>
      </div>
    );
  }
}

// ---------------------------------------------------------------------------
// (e) Extra Credit: HOC that persists the initial value in localStorage
//
// It reads the cached value on mount and uses it as the initial value, and
// writes every change back to localStorage. Next time the app opens, the
// counter starts from the last value the user left it on.
// ---------------------------------------------------------------------------
function withLocalStorage(WrappedComponent, storageKey = "counter-value") {
  return class WithLocalStorage extends Component {
    constructor(props) {
      super(props);

      // read: try the cached value first, fall back to the prop default
      const cached = readFromStorage(storageKey);
      this.cachedInitialValue =
        cached !== null ? cached : props.initialValue ?? 0;
    }

    // write/update: persist every change back to localStorage
    handleChange = (newValue) => {
      writeToStorage(storageKey, newValue);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          initialValue={this.cachedInitialValue}
          onChange={this.handleChange}
        />
      );
    }
  };
}

// Small helpers so the HOC doesn't crash if localStorage is unavailable
function readFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const value = Number(raw);
    return Number.isNaN(value) ? null : value;
  } catch {
    return null;
  }
}

function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore (e.g. private mode / storage disabled)
  }
}

// The exported component is the counter wrapped with persistence.
// Use it like: <PersistentCounter initialValue={0} />
const PersistentCounter = withLocalStorage(Counter);

// ---------------------------------------------------------------------------
// (f) Bonus styling
// ---------------------------------------------------------------------------
const styles = {
  card: {
    width: 260,
    margin: "40px auto",
    padding: 24,
    borderRadius: 16,
    background: "#ffffff",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    textAlign: "center",
  },
  title: {
    margin: "0 0 12px",
    fontSize: 18,
    fontWeight: 600,
    color: "#374151",
  },
  count: {
    fontSize: 56,
    fontWeight: 700,
    color: "#111827",
    margin: "8px 0 20px",
  },
  buttonRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
  },
  button: {
    flex: 1,
    padding: "10px 14px",
    fontSize: 15,
    fontWeight: 600,
    color: "#ffffff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
  increaseBtn: { background: "#22c55e" },
  decreaseBtn: { background: "#ef4444" },
};

export default PersistentCounter;
export { Counter, withLocalStorage };
