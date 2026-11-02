# HackoWeek · Week 17 & 18 — Deep Learning with PyTorch, Transfer Learning, Transformers & LLMs

A practical notebook that moves from NumPy to **PyTorch**: tensors and autograd, MLPs and CNNs on image data, regularization, transfer learning with a pretrained MobileNetV3, sentiment analysis with a Hugging Face Transformer, and a safe, opt-in comparison of hosted vs local LLMs.

**Notebook:** `HACKOWEEK_WEEK_17___18.ipynb`

---

## What's covered

| # | Topic | What the notebook does |
|---|-------|------------------------|
| 1 | **Tensors, autograd & gradient descent** | Tensor shapes, matmul, broadcasting, `.backward()`. Fits `y = 3x + 2` with manual gradient descent and with `nn.Linear` + `SGD`. |
| 2 | **Multi-Layer Perceptron (MLP)** | `64 → 128 → 64 → 10` network with ReLU on the **digits** dataset. Training/validation curves and a confusion matrix. |
| 3 | **Convolutional Neural Network (CNN)** | `DigitCNN` with two Conv + MaxPool blocks. Compared against the MLP, plus learned filters and misclassified images. |
| 4 | **Regularization** | Dropout, BatchNorm and Early Stopping tested on only **150 training samples** to make overfitting visible. |
| 5 | **Transfer learning** | Pretrained **MobileNetV3 Small** (ImageNet), frozen backbone, new 10-class head trained on upscaled digits. |
| 6 | **Transformers (Hugging Face)** | Sentiment analysis with **DistilBERT** via `pipeline`, plus a manual tokenizer + model walkthrough. |
| 7 | **LLMs: hosted vs local** | Text generation, summarization and Q&A through Anthropic, OpenAI, local Hugging Face (Flan-T5) and Ollama. **All paid or heavy calls are OFF by default.** |

---

## Key results

### Core PyTorch
| Experiment | Result |
|------------|--------|
| Autograd check, `y = x³ + 3x` at `x = 2` | `dy/dx = 15` (matches analytical) |
| Manual GD vs `nn.Linear` + SGD | Both give `w = 2.997`, `b = 2.006` (true: 3 and 2) |
| Data split (stratified) | 1078 train / 359 validation / 360 test |

### MLP vs CNN (digits, full training set, 30 epochs)
| Model | Parameters | Val accuracy | Test accuracy |
|-------|-----------|--------------|---------------|
| MLP | 17,226 | 0.9666 | **0.9611** |
| CNN | 13,706 | 0.9582 | **0.9500** |

The CNN is smaller but did not beat the MLP here. The digit images are only 8×8 pixels, so there is little spatial structure for convolutions to exploit.

### Regularization (150 training samples, up to 100 epochs)
| Model | Epochs run | Best epoch | Test acc | Min val loss |
|-------|-----------|-----------|----------|--------------|
| Baseline | 100 | 23 | 0.875 | 0.3731 |
| Dropout (0.5) | 100 | 64 | 0.878 | 0.3490 |
| BatchNorm | 100 | 32 | **0.900** | **0.2958** |
| Baseline + EarlyStop | 30 | 20 | 0.875 | 0.3791 |
| Dropout (0.3) + BN + EarlyStop | 32 | 22 | 0.892 | 0.3062 |

All models reach 100 % training accuracy, so the train–validation gap stays around 0.10 for each. Early stopping mainly **prevents validation loss from drifting upward** (e.g. +0.0749 above its minimum for the baseline vs +0.0039 for the combined model), and BatchNorm gave the best test accuracy. These are single-seed runs on a small dataset, so differences of a percent or two should not be over-interpreted.

### Transfer learning (MobileNetV3 Small, 5 epochs, head only)
| Item | Value |
|------|-------|
| Pretrained ImageNet weights | Loaded successfully |
| Total / trainable / frozen parameters | 1,528,106 / 601,098 / 927,008 |
| Validation accuracy after epoch 5 | 0.869 |
| **Test accuracy** | **0.8889** |

This is lower than the MLP trained from scratch. Digits look very different from ImageNet photos, so the notebook is meant to demonstrate the **mechanics** of freezing a backbone and swapping the head, not an ideal use case.

### Sentiment analysis (DistilBERT, SST-2)
| Sentence (shortened) | Prediction | Confidence |
|----------------------|-----------|------------|
| "I absolutely loved this movie…" | POSITIVE | 0.9999 |
| "The service was terrible…" | NEGATIVE | 0.9997 |
| "The package arrived on Tuesday." | POSITIVE | 0.9830 |
| "What a wonderful day to learn…" | POSITIVE | 0.9999 |
| "I am disappointed with the quality…" | NEGATIVE | 0.9998 |
| "The new update made the app faster…" | POSITIVE | 0.9941 |

The neutral sentence ("The package arrived on Tuesday.") is labelled POSITIVE with high confidence. The model only has two classes (no neutral), so confidence is **not** the same as correctness.

---

## Setup

```bash
pip install torch torchvision scikit-learn matplotlib numpy jupyter transformers
# optional, only for the hosted-API cells
pip install openai anthropic
jupyter notebook HACKOWEEK_WEEK_17___18.ipynb
```

- Runs on **CPU**; a GPU is used automatically if available (`cuda`).
- Seeds are fixed (`SEED = 42`) for reproducibility.
- **Internet is needed on first run** to download MobileNetV3 weights (~10 MB) and the DistilBERT model. If the MobileNet download fails, the notebook falls back to a random backbone and prints a clear warning that the results are then *not* transfer learning.

## Using the LLM section safely

Nothing is called unless you enable it. In the configuration cell, set the flag you want to `True`:

| Flag | Provider | Requirements |
|------|----------|--------------|
| `RUN_ANTHROPIC` | Anthropic API | `pip install anthropic`, `ANTHROPIC_API_KEY` |
| `RUN_OPENAI` | OpenAI API | `pip install openai`, `OPENAI_API_KEY` |
| `RUN_HUGGINGFACE_LOCAL` | `google/flan-t5-small` (~300 MB) | `transformers`, ~1–2 GB RAM |
| `RUN_OLLAMA` | Local Ollama server (`llama3.2`) | Install Ollama, run `ollama pull llama3.2` |

**Never paste API keys into the notebook.** Set them as environment variables before launching Jupyter:

```bash
export ANTHROPIC_API_KEY=your_key      # Linux / macOS
setx ANTHROPIC_API_KEY your_key        # Windows
```

Default model names can be overridden with `ANTHROPIC_MODEL`, `OPENAI_MODEL`, `OLLAMA_MODEL` and `OLLAMA_URL`. Hosted APIs are billed per token.

## Hosted API vs local model

| | Hosted API | Local open model |
|---|-----------|------------------|
| Quality | Usually strongest | Depends on model size |
| Cost | Pay per token | Free after download |
| Privacy | Prompts sent to a provider | Data stays on your machine |
| Offline | No | Yes, after download |
| Hardware | None | Needs RAM / GPU |

## Takeaways

1. Autograd removes the need to derive gradients by hand, and `nn.Module` + `optim` give the same result as a manual loop.
2. Bigger or fancier is not always better: on tiny 8×8 digits the MLP matched or beat the CNN.
3. With little data, every model overfits. Early stopping and BatchNorm help, but more data helps most.
4. Transfer learning needs a source domain that resembles the target. It is powerful for natural images, less so for digits.
5. Pretrained Transformers are easy to use through `pipeline`, but always check their label set and limits (a binary sentiment model has no "neutral").
