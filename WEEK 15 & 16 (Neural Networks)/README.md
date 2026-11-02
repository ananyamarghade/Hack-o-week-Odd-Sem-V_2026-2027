# HackoWeek · Week 15 & 16 — Neural Networks from Scratch (NumPy)

A hands-on notebook that builds a neural network **from first principles using only NumPy** — no deep learning framework. It starts with saving classical ML models, then walks through the perceptron, activation functions, forward/backward propagation, loss functions and optimizers, and finishes with a complete, reusable `NeuralNetwork` class trained on a nonlinear dataset.

**Notebook:** `HACKOWEEK_WEEK_15___16.ipynb`

---

## What's covered

| # | Topic | What the notebook does |
|---|-------|------------------------|
| 1 | **Model persistence** | Trains a Logistic Regression on Iris, saves it with `pickle` and `joblib`, reloads both, and verifies the predictions are identical to the original. |
| 2 | **Perceptron** | Implements a single neuron (weights, bias, step function, perceptron learning rule) and teaches it the **AND gate**. Plots the learned decision boundary. |
| 3 | **Activation functions** | Implements and plots **Sigmoid, ReLU and Tanh**, and explains why non-linearity is essential. |
| 4 | **Forward propagation** | Builds a 2-layer network (tanh hidden layer, sigmoid output) and runs it on the **make_moons** dataset. |
| 5 | **Loss function** | Implements **Binary Cross-Entropy** with numerical clipping and compares good / uncertain / bad predictions. |
| 6 | **Backward propagation** | Derives and codes the gradients with the chain rule, then **verifies them against numerical gradients** (gradient checking). |
| 7 | **Optimizers** | Implements **SGD** and **Adam** from scratch and compares their training loss curves. |
| 8 | **Full neural network class** | Combines everything into a `NeuralNetwork` class with `fit`, `predict_proba`, `predict` and `evaluate`. Plots decision boundaries and saves/restores the trained weights as `.npz`. |

---

## Key results

| Experiment | Result |
|------------|--------|
| Logistic Regression on Iris (120 train / 30 test) | **96.67 %** test accuracy |
| Pickle vs Joblib reload | Predictions identical to original; file sizes 836 B (pickle) vs 991 B (joblib) |
| Perceptron on AND gate | Learned weights `[0.2, 0.1]`, bias `-0.2` — all 4 cases correct |
| BCE loss demo | Good = 0.0783, Uncertain = 0.6931, Bad = 2.6492 |
| Gradient check | Analytical vs numerical gradients differ by only ~1e-12 to 1e-14 |
| SGD (lr 0.1) vs Adam (lr 0.01), 500 epochs | Final training loss **0.3414** vs **0.0707** |
| NumPy neural network on moons | Train accuracy **98 %**, test accuracy **93 %** (test loss 0.1875) |
| Confusion matrix (test) | `[[46, 4], [3, 47]]` |
| Save/restore weights (`.npz`) | Predictions and probabilities identical after reload |

> **Note:** SGD and Adam were compared at different learning rates (0.1 and 0.01), as those are the values used in the notebook. The comparison shows how each behaves under its own setting, not a controlled same-learning-rate test.

---

## The math in one place

- **Weighted sum:** `z = w·x + b`
- **Perceptron update:** `w ← w + η (y − ŷ) x`, `b ← b + η (y − ŷ)`
- **Forward pass:** `Z1 = X·W1 + b1` → `A1 = tanh(Z1)` → `Z2 = A1·W2 + b2` → `A2 = σ(Z2)`
- **Loss (BCE):** `L = −mean[ y·log(ŷ) + (1−y)·log(1−ŷ) ]`
- **Backward pass:** `dZ2 = A2 − y`, `dW2 = A1ᵀ·dZ2 / m`, `dZ1 = (dZ2·W2ᵀ) ⊙ (1 − A1²)`, `dW1 = Xᵀ·dZ1 / m`
- **Adam:** running averages of gradient and squared gradient with bias correction

---

## Setup

```bash
pip install numpy matplotlib scikit-learn joblib jupyter
jupyter notebook HACKOWEEK_WEEK_15___16.ipynb
```

Run all cells from top to bottom. Everything uses fixed random seeds (`42`), so results are reproducible.

## Files generated when you run the notebook

| File | Description |
|------|-------------|
| `iris_model.pkl` | Logistic Regression saved with pickle |
| `iris_model.joblib` | Logistic Regression saved with joblib |
| `neural_network_parameters.npz` | Trained weights (`W1`, `b1`, `W2`, `b2`) of the NumPy network |

## Datasets

- **Iris** (`sklearn.datasets.load_iris`) — 150 samples, 3 classes
- **Moons** (`sklearn.datasets.make_moons`, 400 samples, noise 0.2) — a nonlinear binary problem; 300 train / 100 test

## Takeaways

1. A single perceptron can only learn **linearly separable** patterns (like AND); hidden layers with non-linear activations are needed for curved boundaries such as the moons.
2. Backpropagation is just the **chain rule**, and gradient checking is a reliable way to confirm an implementation is correct.
3. **Adam** reached a much lower training loss than plain SGD in the same number of epochs here.
4. Train accuracy (98 %) vs test accuracy (93 %) shows a small generalization gap, which is expected on a small, noisy dataset.
5. Use `joblib` for scikit-learn models with large NumPy arrays and `np.savez` for raw weights. Only load pickle files you trust.
