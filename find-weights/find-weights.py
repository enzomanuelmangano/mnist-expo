import tensorflow as tf
import json
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.utils import to_categorical

# Load MNIST data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

# Convert labels to one-hot encoding
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

# Build the model with two hidden layers of 50 neurons
model = Sequential([
    Flatten(input_shape=(28, 28)),       # Flatten the 28x28 image to a vector of size 784
    Dense(50, activation='relu'),        # First hidden layer with 50 neurons
    Dense(50, activation='relu'),        # Second hidden layer with 50 neurons
    Dense(10, activation='softmax')      # Output layer for 10 classes
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(x_train, y_train, epochs=5, batch_size=32, validation_data=(x_test, y_test))

# Save the trained weights in H5 format
model.save_weights("mnist_two_hidden_layers.weights.h5")

# Save weights in JSON format
weights = model.get_weights()
weights_dict = {f"weight_{i}": weight.tolist() for i, weight in enumerate(weights)}

with open('model_weights.json', 'w') as json_file:
    json.dump(weights_dict, json_file)
