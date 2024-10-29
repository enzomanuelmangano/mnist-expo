import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import ModelWeights from '../find-weights/model_weights.json';
import NoneMatrix from '../find-weights/examples/none.json';

import * as nn from './neural-network';
import { Grid } from './components/grid';
import { NeuralNetwork } from './components/neural-network';
import type { PredictResult } from './neural-network';

const {
  weight_0: inputLayerWeights,
  weight_1: inputLayerBias,
  weight_2: hiddenLayerWeights,
  weight_3: hiddenLayerBias,
  weight_4: outputLayerWeights,
  weight_5: outputLayerBias,
} = ModelWeights;

const ModelWeightsFlat = {
  inputLayerWeights: inputLayerWeights,
  inputLayerBias: inputLayerBias,
  hiddenLayerWeights: hiddenLayerWeights,
  hiddenLayerBias: hiddenLayerBias,
  outputLayerWeights: outputLayerWeights,
  outputLayerBias: outputLayerBias,
};

const App = () => {
  const getMaxIndex = (arr: number[]) => {
    'worklet';
    return arr.indexOf(Math.max(...arr));
  };
  const predictions = useSharedValue<PredictResult>(
    nn.predict(ModelWeightsFlat, NoneMatrix.matrix),
  );

  const onUpdate = useCallback(
    (squaresGrid: number[][]) => {
      'worklet';

      const result = nn.predict(ModelWeightsFlat, squaresGrid);
      predictions.value = result;

      const predictedClass = getMaxIndex(result.finalOutput);
      console.log('Predicted class:', predictedClass);
    },
    [predictions],
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Grid onUpdate={onUpdate} />
      <NeuralNetwork weights={ModelWeightsFlat} predictions={predictions} />
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
