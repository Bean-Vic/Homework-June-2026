// App.jsx
import Counter from "./Counter";
import withLocalStorage from "./withLocalStorage";
import ShoppingCart from "./shoppingCart";

const PersistentCounter = withLocalStorage(Counter, "counterValue");

export default function App() {
  return (
    <div>
      <PersistentCounter initialValue={0} />
      <ShoppingCart />
    </div>
  );
}
