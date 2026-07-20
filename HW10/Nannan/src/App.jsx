import { Provider } from 'react-redux';
import { store } from './store/store';
import DogViewer from './components/DogViewer';

function App() {
  return (
    <Provider store={store}>
      <DogViewer />
    </Provider>
  );
}

export default App;
