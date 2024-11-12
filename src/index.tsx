import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useRef } from 'react';
import { useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { PressableScale } from 'pressto';

import ModelWeights from '../find-weights/model_weights.json';
import NoneMatrix from '../find-weights/examples/none.json';

import * as nn from './neural-network';
import type { GridHandleRef } from './components/grid';
import { Grid } from './components/grid';
import { NeuralNetwork } from './components/network';
import type { PredictResult } from './neural-network';
import { Predictions } from './components/predictions';

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
  const predictions = useSharedValue<PredictResult>(
    nn.predict(ModelWeightsFlat, NoneMatrix.matrix),
  );

  const onUpdate = useCallback(
    (squaresGrid: number[][]) => {
      'worklet';

      const result = nn.predict(ModelWeightsFlat, squaresGrid);
      predictions.value = result;
    },
    [predictions],
  );

  const gridRef = useRef<GridHandleRef>(null);

  const finalOutput = useDerivedValue(() => predictions.value.finalOutput);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.fillCenter}>
        <NeuralNetwork weights={ModelWeightsFlat} predictions={predictions} />
        <Predictions finalOutput={finalOutput} />
      </View>
      <View style={styles.fill}>
        <Grid ref={gridRef} onUpdate={onUpdate} />
      </View>

      <PressableScale
        style={styles.floatingButton}
        onPress={() => {
          gridRef.current?.clear();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  fillCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  floatingButton: {
    height: 52,
    aspectRatio: 1,
    borderRadius: 26,
    backgroundColor: '#a1a1a1',
    position: 'absolute',
    bottom: 52,
    right: 52,
  },
});

export { App };
