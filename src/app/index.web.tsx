import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { ActivityIndicator, View } from 'react-native';

const loaderStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000',
} as const;

const Loader = () => {
  return (
    <View style={loaderStyle}>
      <ActivityIndicator />
    </View>
  );
};

function App() {
  return (
    <WithSkiaWeb
      fallback={<Loader />}
      getComponent={() => {
        return require('../components/main');
      }}
    />
  );
}

// eslint-disable-next-line import/no-default-export
export default gestureHandlerRootHOC(App);
