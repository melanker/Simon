/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Provider } from 'react-redux';
/*
//import configStore from './SRC/store';
const store = configStore()
const RNRedux = () => (
  <Provider store = { store }>
    <App />
  </Provider>
)
*/

AppRegistry.registerComponent(appName, () => App);
