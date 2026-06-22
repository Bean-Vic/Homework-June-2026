import { Component } from "react";

function withLocalStorage(WrappedComponent, storageKey) {
  return class extends Component {
    constructor(props) {
      super(props);
      // 读取 localStorage，没有则用传入的 initialValue
      const saved = localStorage.getItem(storageKey);
      this.cachedInitial = saved !== null ? Number(saved) : props.initialValue ?? 0;
    }

    // 每次子组件更新 count 时写入 localStorage
    handleUpdate = (newValue) => {
      localStorage.setItem(storageKey, newValue);
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          initialValue={this.cachedInitial}
          onUpdate={this.handleUpdate}
        />
      );
    }
  };
}

export default withLocalStorage;
