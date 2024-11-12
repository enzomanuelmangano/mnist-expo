import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import Main from '../components/main';

function App() {
  return <Main />;
}

// eslint-disable-next-line import/no-default-export
export default gestureHandlerRootHOC(App);
