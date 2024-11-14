# MNIST Digit Recognition

A React Native application that recognizes handwritten digits using a neural network trained on the MNIST dataset. The app includes a real-time visualization of the neural network's decision-making process.

It uses the following libraries:

- React Native Skia for rendering the Network and the digit
- React Native Reanimated for animating everything
- React Native Gesture Handler for drawing the digit

https://github.com/user-attachments/assets/5a66e3f5-c653-4c01-849c-c2b8a29e5308

Everything runs magically on Expo Go and on the Web at [mnist.reactiive.io](https://mnist.reactiive.io).

I was strongly inspired by this Brilliant demo: [Network Visualization](https://x.com/gabeElbling/status/1850220333631943068)

## Finding the proper weights (needs improvement)

The generated weights are given in the `find-weights` folder. I included them in the repo for convenience. They are generated using the Python script in the `find-weights` folder.

The `find-weights.py` script:

1. Loads the network configuration from `network.config.json`
2. Loads and preprocesses the MNIST dataset:
   - Converts images to binary (0 and 1)
   - Adds a "none" class with empty samples
   - Converts labels to one-hot encoding
3. Builds and trains a neural network with:
   - 2 hidden layers using configurations from `network.config.json`
   - Adam optimizer and categorical crossentropy loss
   - 5 training epochs
4. Saves the trained weights to `model_weights.json`
5. Generates example images and matrices for each digit (0-9) and the "none" class

To run the script:

1. Set up a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

2. Install the required dependencies:
   ```bash
   cd find-weights
   pip install -r requirements.txt
   ```

3. Run the script:
   ```bash
   python find-weights.py
   ```
