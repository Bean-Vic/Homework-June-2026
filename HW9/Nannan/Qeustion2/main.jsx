import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import CounterApp from './components/CounterApp';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <CounterApp />
    </Provider>
  </StrictMode>
);
