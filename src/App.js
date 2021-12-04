import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { appReducer } from './store';
import { MainViewComponent } from './components/main-view';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(appReducer);

function App() {
  return (
    <Provider store={store}>
      <MainViewComponent />
    </Provider>
  );
}

export default App;
