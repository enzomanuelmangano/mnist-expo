import { Text, useWindowDimensions, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import Animated, { useDerivedValue } from 'react-native-reanimated';
import { useMemo } from 'react';
import type { SkPath } from '@shopify/react-native-skia';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

import type { NeuralNetworkWeights, PredictResult } from '../../neural-network';

type NeuralNetworkProps = {
  weights: NeuralNetworkWeights;
  predictions: SharedValue<PredictResult>;
};

type SquareProps = {
  progress: SharedValue<number>;
  size: number;
};

const color = '#d2d2d2';

const Square = ({ progress, size }: SquareProps) => {
  return (
    <View
      style={{
        height: size,
        width: size,
        borderWidth: 1,
        borderColor: color,
        borderRadius: 40,
        padding: 2,
      }}>
      <Animated.View
        style={{
          opacity: progress,
          flex: 1,
          backgroundColor: color,
          borderRadius: 30,
        }}
      />
    </View>
  );
};

const drawLayerConnections = ({
  fromCoords,
  toCoords,
  layerWeights,
  path,
  weightThreshold,
  type,
}: {
  fromCoords: Array<{ x: number; y: number }>;
  toCoords: Array<{ x: number; y: number }>;
  layerWeights: number[][];
  path: SkPath;
  weightThreshold: number;
  type: 'positive' | 'negative';
}) => {
  fromCoords.forEach((fromNode, i) => {
    toCoords.forEach((toNode, j) => {
      const weight = layerWeights[i][j];
      if (weight > 0 && type === 'negative') {
        return;
      }
      if (weight < 0 && type === 'positive') {
        return;
      }
      const absoluteWeight = Math.abs(weight);
      if (absoluteWeight < weightThreshold) {
        return;
      }
      path.moveTo(fromNode.x, fromNode.y);
      path.lineTo(toNode.x, toNode.y);
    });
  });
};

export const NeuralNetwork = ({ weights, predictions }: NeuralNetworkProps) => {
  const { width } = useWindowDimensions();

  const paddingHorizontal = (width * 0.1) / 2;
  const circleRadius = 2.5;
  const marginLayers = 7;
  const distanceBetweenLayers = 100;
  const baseY = 20;

  const firstLayerCoords = useMemo(() => {
    const layer2 = weights.hiddenLayerWeights;
    return layer2.map((_, i) => ({
      x: i * marginLayers + paddingHorizontal,
      y: baseY,
    }));
  }, [weights, paddingHorizontal]);

  const secondLayerCoords = useMemo(() => {
    const layer2 = weights.outputLayerWeights;
    return layer2.map((_, i) => ({
      x: i * marginLayers + paddingHorizontal,
      y: baseY + distanceBetweenLayers,
    }));
  }, [weights, paddingHorizontal]);

  const outputLayerCoords = useMemo(() => {
    const layer3 = predictions.value.finalOutput;
    const layer2 = weights.outputLayerWeights;

    return layer3.map((_, i) => ({
      x:
        i * marginLayers +
        paddingHorizontal +
        ((layer2.length - layer3.length) * marginLayers) / 2,
      y: baseY + distanceBetweenLayers * 2,
    }));
  }, [predictions, paddingHorizontal, weights]);

  const networkPath = useMemo(() => {
    const skPath = Skia.Path.Make();

    for (let i = 0; i < firstLayerCoords.length; i++) {
      skPath.addCircle(
        firstLayerCoords[i].x,
        firstLayerCoords[i].y,
        circleRadius,
      );
    }

    for (let i = 0; i < secondLayerCoords.length; i++) {
      skPath.addCircle(
        secondLayerCoords[i].x,
        secondLayerCoords[i].y,
        circleRadius,
      );
    }

    for (let i = 0; i < outputLayerCoords.length; i++) {
      skPath.addCircle(
        outputLayerCoords[i].x,
        outputLayerCoords[i].y,
        circleRadius,
      );
    }

    return skPath;
  }, [firstLayerCoords, secondLayerCoords, outputLayerCoords]);

  const WEIGHT_THRESHOLD = 0.35;

  const positiveWeightLines = useMemo(() => {
    const skPath = Skia.Path.Make();

    // Draw connections between layers
    drawLayerConnections({
      fromCoords: firstLayerCoords,
      toCoords: secondLayerCoords,
      layerWeights: weights.hiddenLayerWeights,
      path: skPath,
      weightThreshold: WEIGHT_THRESHOLD,
      type: 'positive',
    });

    drawLayerConnections({
      fromCoords: secondLayerCoords,
      toCoords: outputLayerCoords,
      layerWeights: weights.outputLayerWeights,
      path: skPath,
      weightThreshold: WEIGHT_THRESHOLD,
      type: 'negative',
    });

    return skPath;
  }, [firstLayerCoords, secondLayerCoords, outputLayerCoords, weights]);

  const negativeWeightLines = useMemo(() => {
    const skPath = Skia.Path.Make();

    // Draw connections between layers
    drawLayerConnections({
      fromCoords: firstLayerCoords,
      toCoords: secondLayerCoords,
      layerWeights: weights.hiddenLayerWeights,
      path: skPath,
      weightThreshold: WEIGHT_THRESHOLD,
      type: 'negative',
    });

    drawLayerConnections({
      fromCoords: secondLayerCoords,
      toCoords: outputLayerCoords,
      layerWeights: weights.outputLayerWeights,
      path: skPath,
      weightThreshold: WEIGHT_THRESHOLD,
      type: 'negative',
    });

    return skPath;
  }, [firstLayerCoords, secondLayerCoords, outputLayerCoords, weights]);

  return (
    <View>
      <Canvas
        style={{
          width,
          height: distanceBetweenLayers * 2 + baseY * 2,
        }}>
        <Path
          path={positiveWeightLines}
          color={'blue'}
          style="stroke"
          opacity={0.5}
        />
        <Path
          path={negativeWeightLines}
          opacity={0.5}
          color={'red'}
          style="stroke"
        />
        <Path path={networkPath} color={'#d2d2d2'} style="fill" />
      </Canvas>
      <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
        {predictions.value.finalOutput.map((_, i) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const progress = useDerivedValue(
            () => predictions.value.finalOutput[i],
          );
          return (
            <View
              key={i}
              style={{
                gap: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color }}>{i === 10 ? 'N/A' : i}</Text>
              <Square progress={progress} size={20} />
            </View>
          );
        })}
      </View>
    </View>
  );
};
