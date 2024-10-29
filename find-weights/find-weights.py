import tensorflow as tf
import json
import numpy as np
from tensorflow.keras.datasets import mnist
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.utils import to_categorical
import os
import matplotlib.pyplot as plt

# Load MNIST data
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Convert data to binary (0 and 1)
x_train = np.where(x_train > 127.5, 1.0, 0.0)
x_test = np.where(x_test > 127.5, 1.0, 0.0)

# Add None class (all zeros) to training and test data
none_train = np.zeros((5000, 28, 28))  # Create 5000 empty samples
none_test = np.zeros((1000, 28, 28))   # Create 1000 empty samples

x_train = np.concatenate([x_train, none_train])
x_test = np.concatenate([x_test, none_test])

# Add labels for None class (class 10)
none_train_labels = np.full((5000,), 10)
none_test_labels = np.full((1000,), 10)

y_train = np.concatenate([y_train, none_train_labels])
y_test = np.concatenate([y_test, none_test_labels])

# Convert labels to one-hot encoding (now 11 classes including None)
y_train = to_categorical(y_train, 11)
y_test = to_categorical(y_test, 11)

# Build the model with two hidden layers of 50 neurons
model = Sequential([
    Flatten(input_shape=(28, 28)),       # Flatten the 28x28 image to a vector of size 784
    Dense(50, activation='relu'),        # First hidden layer with 50 neurons
    Dense(50, activation='relu'),        # Second hidden layer with 50 neurons
    Dense(11, activation='softmax')      # Output layer for 11 classes (0-9 + None)
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
history = model.fit(x_train, y_train, epochs=5, batch_size=32, validation_data=(x_test, y_test))

# Evaluate the model on test data
test_loss, test_accuracy = model.evaluate(x_test, y_test, verbose=0)
print(f'\nTest accuracy: {test_accuracy:.4f}')
print(f'Test loss: {test_loss:.4f}')

# Print training history
print('\nTraining History:')
print(f'Final training accuracy: {history.history["accuracy"][-1]:.4f}')
print(f'Final validation accuracy: {history.history["val_accuracy"][-1]:.4f}')

# Save weights in JSON format
weights = model.get_weights()
weights_dict = {f"weight_{i}": weight.tolist() for i, weight in enumerate(weights)}

with open('model_weights.json', 'w') as json_file:
    json.dump(weights_dict, json_file)

# Create examples folder
examples_dir = 'examples'
if not os.path.exists(examples_dir):
    os.makedirs(examples_dir)

# Save example images and matrices for each digit and none
for digit in range(11):  # 0-9 and None
    if digit == 10:  # None class
        img = np.zeros((28, 28))
        img_filename = f'{examples_dir}/none.png'
        json_filename = f'{examples_dir}/none.json'
    else:
        # Find first occurrence of digit in test set
        digit_idx = np.where(y_test[:, digit] == 1)[0][0]
        img = x_test[digit_idx]
        img_filename = f'{examples_dir}/{digit}.png'
        json_filename = f'{examples_dir}/{digit}.json'
    
    # Save image
    plt.imsave(img_filename, img, cmap='gray')
    
    # Save matrix as JSON
    matrix_dict = {"matrix": img.tolist()}
    with open(json_filename, 'w') as json_file:
        json.dump(matrix_dict, json_file)
        
    print(f'Saved example image and matrix for {"none" if digit == 10 else str(digit)}')
