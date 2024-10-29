import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCallback } from 'react';

import ModelWeights from '../find-weights/model_weights.json';

import * as nn from './neural-network';
import { Grid } from './components/grid';

const {
  weight_0: inputLayerWeights,
  weight_1: inputLayerBias,
  weight_2: hiddenLayerWeights,
  weight_3: hiddenLayerBias,
  weight_4: outputLayerWeights,
  weight_5: outputLayerBias,
} = ModelWeights;

const transposeMatrix = (matrix: number[][]) => {
  'worklet';
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

const FlattenedModelWeights = (() => {
  'worklet';

  return {
    inputLayerWeights: transposeMatrix(inputLayerWeights),
    inputLayerBias: inputLayerBias,
    hiddenLayerWeights: transposeMatrix(hiddenLayerWeights),
    hiddenLayerBias: hiddenLayerBias,
    outputLayerWeights: transposeMatrix(outputLayerWeights),
    outputLayerBias: outputLayerBias,
  };
})();

const App = () => {
  const getMaxIndex = (arr: number[]) => {
    'worklet';
    return arr.indexOf(Math.max(...arr));
  };
  const onUpdate = useCallback((squaresGrid: number[][]) => {
    'worklet';

    const result = nn.predict(
      FlattenedModelWeights,
      transposeMatrix(squaresGrid),
    );

    const predictedClass = getMaxIndex(result.finalOutput);
    console.log('Predicted class:', predictedClass);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Grid onUpdate={onUpdate} />
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
