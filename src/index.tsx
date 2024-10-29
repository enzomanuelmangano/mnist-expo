import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import ModelWeights from '../find-weights/model_weights.json';

async function loadAndInspectModel() {
  const {
    weight_0: inputLayerWeights,
    weight_1: inputLayerBias,
    weight_2: hiddenLayerWeights,
    weight_3: hiddenLayerBias,
    weight_4: outputLayerWeights,
    weight_5: outputLayerBias,
  } = ModelWeights;

  console.log(inputLayerWeights.length);
  console.log(inputLayerBias.length);
  console.log(hiddenLayerWeights.length);
  console.log(hiddenLayerBias.length);
  console.log(outputLayerWeights.length);
  console.log(outputLayerBias.length);
}

const App = () => {
  useEffect(() => {
    loadAndInspectModel();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { App };
