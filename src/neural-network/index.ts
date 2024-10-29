type NeuralNetworkWeights = {
  inputLayerWeights: number[];
  inputLayerBias: number[];
  hiddenLayerWeights: number[];
  hiddenLayerBias: number[];
  outputLayerWeights: number[];
  outputLayerBias: number[];
};

function relu(x: number): number {
  return Math.max(0, x);
}

function softmax(arr: number[]): number[] {
  const maxVal = Math.max(...arr);
  const expValues = arr.map(x => Math.exp(x - maxVal));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  return expValues.map(exp => exp / sumExp);
}

function matrixVectorMultiply(
  matrix: number[],
  vector: number[],
  rows: number,
  cols: number,
): number[] {
  const result = new Array(rows).fill(0);
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result[i] += matrix[i * cols + j] * vector[j];
    }
  }
  return result;
}

export function predict(
  weights: NeuralNetworkWeights,
  input: number[],
): {
  hidden1Output: number[];
  hidden2Output: number[];
  finalOutput: number[];
} {
  // First hidden layer
  const hidden1 = matrixVectorMultiply(
    weights.inputLayerWeights,
    input,
    50,
    784,
  );
  const hidden1Output = hidden1.map((val, i) =>
    relu(val + weights.inputLayerBias[i]),
  );

  // Second hidden layer
  const hidden2 = matrixVectorMultiply(
    weights.hiddenLayerWeights,
    hidden1Output,
    50,
    50,
  );
  const hidden2Output = hidden2.map((val, i) =>
    relu(val + weights.hiddenLayerBias[i]),
  );

  // Output layer
  const output = matrixVectorMultiply(
    weights.outputLayerWeights,
    hidden2Output,
    10,
    50,
  );
  const preActivationOutput = output.map(
    (val, i) => val + weights.outputLayerBias[i],
  );

  // Apply softmax activation
  const finalOutput = softmax(preActivationOutput);

  return {
    hidden1Output,
    hidden2Output,
    finalOutput,
  };
}
