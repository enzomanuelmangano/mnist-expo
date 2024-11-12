import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

function App() {
  return (
    <WithSkiaWeb
      fallback={<></>}
      getComponent={() => {
        return require('../components/main');
      }}
    />
  );
}

// eslint-disable-next-line import/no-default-export
export default gestureHandlerRootHOC(App);
