<div align="center">

#  Hack-o-week — Semester V

**A journey from a raw Node.js API to transfer learning and Transformers, told through real-world projects.**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-189AB4?style=flat&logoColor=white)
![LightGBM](https://img.shields.io/badge/LightGBM-2E8B57?style=flat&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)
![Hugging Face](https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat&logo=huggingface&logoColor=black)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=flat&logo=jupyter&logoColor=white)

</div>

---

## 📖 About

This repository documents eighteen weeks of practical implementation completed during the Semester V **Hack-o-week** program — ten sprints, each pairing a technical skill set with a real-world dataset or product build. The work moves from a hand-rolled REST API, to a full-stack product, through classic data analysis and ML, into computer vision, unsupervised learning and ensemble methods, and finally into neural networks and deep learning with PyTorch.

> **Progression:** REST APIs → Full-Stack Product → Data Analysis → Linear Algebra & Calculus → Regression & Classification → Model Evaluation → Dimensionality Reduction → Ensemble Methods & Regularization → Neural Networks from Scratch → Deep Learning, Transfer Learning & Transformers

## 📑 Table of Contents

| # | Week(s) | Project | Focus |
|---|---|---|---|
| 1 | [01](#-week-01--rest-api-project) | Expense Tracker API | Node.js REST API |
| 2 | [02](#-week-02--web-development-using-api) | FindIt@Campus | Full-stack product (React + FastAPI + Supabase) |
| 3 | [03 & 04](#-week-03--04--python--data-analysis) | Indian Commodity Price Analysis | Python, Pandas, EDA |
| 4 | [05 & 06](#-week-05--06--linear-algebra--calculus) | Retinal Image Analysis | Linear algebra, calculus, a hand-built neural net |
| 5 | [07 & 08](#-week-07--08--regression--classification) | Household Energy Consumption Prediction | Regression & classification |
| 6 | [09 & 10](#-week-09--10--model-evaluation--feature-engineering) | Cardiovascular Disease Prediction | Feature engineering & evaluation |
| 7 | [11 & 12](#-week-11--12--dimensionality-reduction) | Dimensionality Reduction on Bank Marketing Data | PCA & t-SNE |
| 8 | [13 & 14](#-week-13--14--ensemble-methods--regularization) | Airline Passenger Satisfaction Classification | Bagging, Boosting, XGBoost, LightGBM, bias–variance, regularization |
| 9 | [15 & 16](#-week-15--16--neural-networks-from-scratch) | Neural Networks from Scratch | Perceptron, backpropagation, optimizers (NumPy only) |
| 10 | [17 & 18](#-week-17--18--deep-learning-with-pytorch) | Deep Learning with PyTorch | MLP, CNN, regularization, transfer learning, Transformers, LLMs |

---

## 🔌 Week 01 — REST API Project

### Project: Expense Tracker API

A dependency-free REST API for managing personal expenses, built directly on Node's `http` module.

**Tasks Implemented**
- Built a REST API in Node.js using the core `http` module (no framework)
- Implemented full CRUD for expenses (create, read, update, delete)
- Added category-based filtering (`Food`, `Travel`, `Shopping`, `Bills`, `Health`, `Entertainment`, `Others`)
- Added title-based search and date-descending sorting
- Implemented server-side validation (title, amount, category, date)
- Returned structured JSON responses with appropriate status codes

**Real-World Application**
A minimal but complete backend for recording daily expenses — the foundation the full-stack tracker pattern is built on.

**Key Outcomes**
- Demonstrated how to build a REST API from scratch without a framework
- Implemented request parsing, routing, and JSON responses manually
- Applied validation and query-based filtering to real request data

**Tech Stack:** `JavaScript` · `Node.js` (`http` module) · `REST API`

📂 [`WEEK 01 (RESTAPI PROJECT)/`](<WEEK 01 (RESTAPI PROJECT)>)

---

## 🌐 Week 02 — Web Development Using API

### Project: FindIt@Campus

> Helping students reconnect with their lost belongings.

A production-quality campus lost-and-found platform. Students report lost or found items, browse a Pinterest-style masonry feed, search by name / category / location / date / status, explore an interactive campus map, track an item's journey on a vertical timeline, and view recovery analytics.

**Tech Stack**
- **Frontend** — React, Vite, Tailwind CSS, Framer Motion, lucide-react
- **Backend** — Python, FastAPI
- **Data science** — NumPy, Pandas, Matplotlib, Seaborn
- **Database** — Supabase (PostgreSQL) with Row Level Security

**Architecture**
```
src/
  components/    Reusable UI (Navbar, ItemCard, Modal, Badges, QuickView)
  pages/         Route-level views (Home, Browse, Report, ItemDetail, Map, Analytics)
  lib/           Data layer (supabase client, hooks, router, theme, format)
backend/
  models.py      OOP domain classes (Student, Item, LostReport, FoundReport, ClaimRequest, Location)
  analytics.py   AnalyticsEngine — NumPy vectorized metrics + Pandas DataFrames + Matplotlib/Seaborn charts
  sample_data.py In-memory demo dataset
  main.py        FastAPI app exposing analytics + charts over HTTP
```

**Where the data-science stack earns its place**
- **NumPy** — `recovery_rate()` and `average_recovery_days()` are vectorized over status/timedelta arrays; `daily_statistics()` buckets dates vectorized.
- **Pandas** — Lost/found reports become DataFrames (`to_datetime`, `fillna` cleaning); `_merge_reports()` merges them with `pd.concat`; GroupBy aggregations power category, location, and daily/weekly/monthly reports.
- **Matplotlib & Seaborn** — daily-trend line chart, category bar chart, status pie chart, and a Seaborn heatmap of building × category density, all served as PNGs over the API.

**Features**
- Report lost / found items with image, category, location, reward
- Pinterest-style masonry browse with quick-view modal
- Smart search by name, category, location, date, status
- Interactive SVG campus map — click buildings to filter items
- Vertical item timeline (Lost → Reported → Found → Claimed → Returned)
- Analytics dashboard with recovery rate, avg. recovery time, and daily/weekly/monthly trends
- Dark mode, favorites, QR codes for item claims, exportable analytics report

**Real-World Outcome**
A genuinely usable campus tool that treats analytics as a first-class feature rather than a bolted-on chart, backed by a real Postgres database with row-level security.

**Tech Stack:** `React` · `Vite` · `TypeScript` · `Tailwind CSS` · `FastAPI` · `Supabase (PostgreSQL)` · `NumPy` · `Pandas` · `Matplotlib` · `Seaborn`

📂 [`WEEK 02 (WEB DEVELOPMENT USING API)/`](<WEEK 02 (WEB DEVELOPMENT USING API)>)

---

## 📊 Week 03 & 04 — Python & Data Analysis

### Project: Indian Commodity Price Analysis

**Tasks Implemented**
- Implemented Python functions and Object-Oriented Programming
- Used list and dictionary comprehensions
- Implemented NumPy arrays, broadcasting, and vectorized operations
- Performed data cleaning and preprocessing using Pandas
- Handled missing and inconsistent data
- Used filtering, sorting, merging, GroupBy, and aggregation
- Created statistical and visual analyses using Matplotlib and Seaborn

**Real-World Problem**
Everyday commodity prices can vary significantly across locations and over time. Understanding these variations can help identify price volatility, regional differences, and periods of unusual price changes.

**Analysis Performed**
- Compared prices across different commodities
- Studied regional price differences
- Analysed price variation over time
- Measured commodity-wise price volatility
- Investigated price distributions and outliers
- Examined missing-value patterns in the raw dataset
- Used statistical measures to compare price behaviour

**Key Findings**
- Commodity prices show noticeable variation across different locations and time periods
- Different commodities exhibit different levels of price volatility
- Regional comparisons reveal significant differences in the prices of everyday commodities
- Time-based analysis highlights changing price patterns and periods of increased variation
- Statistical analysis provides a clearer understanding of typical prices, spread, and unusual observations

**Real-World Outcome**
The analysis demonstrates how raw commodity-price data can be transformed into useful information for understanding regional price differences and identifying commodities or periods that require closer monitoring.

**Tech Stack:** `Python` · `NumPy` · `Pandas` · `Matplotlib` · `Seaborn` · `Jupyter Notebook`

📂 [`WEEK 03 & 04 (DATA ANALYSIS)/`](<WEEK 03 & 04 (DATA ANALYSIS)>)

---

## 🧠 Week 05 & 06 — Linear Algebra & Calculus

### Project: Retinal Image Analysis using Linear Algebra & Calculus

A step-by-step build, on real retinal fundus images from the DRIVE vessel-segmentation dataset, that ends in a tiny neural network trained by hand with NumPy — no ML framework involved.

**Tasks Implemented**
- Treated a retinal image as a matrix and explored it as raw pixel intensities
- Extracted fixed-size patches and converted each into a feature vector
- Computed dot products between feature vectors to compare image patches
- Standardized features and computed the covariance matrix, eigenvalues, and eigenvectors (PCA) over real patch data from multiple images
- Computed numerical derivatives directly on image intensities
- Performed gradient-based vessel analysis (image gradients for edge/vessel detection)
- Built a small labeled dataset (`X`, `y`) from the extracted patches
- Hand-built a tiny neural network (4 inputs → 4 hidden neurons (tanh) → 1 output neuron (sigmoid)) using only NumPy
- Derived and implemented the chain rule / backpropagation manually
- Trained the network with gradient descent
- Reconstructed a predicted vessel map from the network's output
- Summarized results numerically

**Real-World Relevance**
Linear Algebra and Calculus form the mathematical foundation of computer vision and machine learning — this project makes that foundation concrete by using them to detect blood vessels in real medical images, end to end, without a black-box framework.

**Key Outcomes**
- Represented and manipulated real image data as vectors and matrices
- Used eigen-decomposition (PCA) to study the directions of greatest variance in real patch features
- Connected numerical differentiation and gradients to actual image intensities and vessel structure
- Derived backpropagation by hand and used it to train a working (if tiny) neural network
- Produced a predicted vessel map as a tangible, visual outcome of the math

**Real-World Outcome**
The result is an automated vessel-region representation, derived entirely from first-principles linear algebra and calculus, that can serve as a foundation for further retinal image analysis.

**Dataset:** DRIVE (Digital Retinal Images for Vessel Extraction)
**Tech Stack:** `Python` · `NumPy` · `OpenCV` · `Matplotlib` · `Google Colab`

📂 [`WEEK 05 & 06 (CALCULUS)/`](<WEEK 05 & 06 (CALCULUS)>)

---

## 📈 Week 07 & 08 — Regression & Classification

### Project: Household Energy Consumption Prediction and High-Consumption Classification

**Tasks Implemented**
- Performed data preprocessing and exploratory data analysis
- Implemented Linear, Polynomial, Ridge, and Lasso Regression
- Compared regression model performance
- Derived a high-energy-consumption classification target
- Implemented Logistic Regression and K-Nearest Neighbors (KNN)
- Performed KNN hyperparameter analysis
- Generated ROC and Precision-Recall curves
- Compared classification model performance
- Analysed Logistic Regression feature coefficients

**Real-World Problem**
Household energy consumption varies according to time, temperature, humidity, lighting, and other environmental conditions. Predicting energy usage and identifying high-consumption periods can help understand household energy behaviour.

**Analysis Performed**
- Analysed daily and hourly energy consumption patterns
- Compared energy consumption across weekdays and weekends
- Studied temperature and humidity relationships with energy consumption
- Investigated indoor and outdoor environmental conditions
- Examined monthly consumption patterns
- Compared actual vs. predicted energy consumption
- Classified observations into normal and high energy consumption
- Compared Logistic Regression and KNN classification performance

**Key Findings**
- Household energy consumption varies noticeably across different times of the day
- Weekday and weekend consumption patterns show differences in energy usage behaviour
- Indoor temperature and humidity variables provide useful information for analysing appliance energy consumption
- Polynomial Regression can model nonlinear relationships between variables
- Ridge and Lasso Regression demonstrate the effect of regularization on model coefficients
- Logistic Regression coefficients help identify features that influence high-consumption classification
- KNN performance varies with the selected number of neighbours
- ROC and Precision-Recall curves provide additional information for evaluating classification performance

**Real-World Outcome**
The project demonstrates how regression and classification techniques can be applied to real-world household energy data to predict energy consumption and identify high-consumption conditions.

**Tech Stack:** `Python` · `NumPy` · `Pandas` · `Matplotlib` · `Seaborn` · `Scikit-learn` · `Jupyter Notebook` · `Google Colab`

📂 [`WEEK 07 & 08 (C&R)/`](<WEEK 07 & 08 (C&R)>)

---

## 🩺 Week 09 & 10 — Model Evaluation & Feature Engineering

### Project: Cardiovascular Disease Prediction

A real-world machine learning project on a cardiovascular disease dataset of roughly 70,000 patient records, covering demographic, physical, lifestyle, and health-related attributes.

**Tasks Implemented**
- Performed exploratory data analysis on cardiovascular health data
- Analysed missing values and duplicate records
- Engineered features: age in years, age groups, BMI, pulse pressure
- Encoded categorical variables and handled missing data via preprocessing pipelines
- Applied feature scaling using StandardScaler
- Performed a stratified train-test split
- Implemented Logistic Regression, KNN, Decision Tree, and Random Forest
- Performed 5-fold cross-validation
- Generated confusion matrices
- Calculated precision, recall, F1-score, and ROC-AUC
- Generated ROC and Precision-Recall curves
- Compared classification model performance

**Real-World Problem**
Cardiovascular disease is influenced by multiple demographic, physical, and lifestyle-related factors. A medical classification model shouldn't be judged on accuracy alone, which makes rigorous evaluation especially important here.

**Analysis Performed**
- Analysed cardiovascular disease class distribution
- Studied age and blood pressure relationships with disease outcomes
- Compared cholesterol and glucose levels across outcomes
- Investigated BMI and cardiovascular disease
- Studied smoking, alcohol consumption, and physical activity
- Examined correlations between health-related variables
- Compared model performance using cross-validation and ROC / Precision-Recall curves

**Key Findings**
- Demographic, physical, and health-related variables provide useful information for cardiovascular disease classification
- Age and blood pressure measurements show noticeable patterns across cardiovascular disease outcomes
- BMI and pulse pressure are useful engineered representations of height/weight and blood pressure data
- Feature scaling is particularly important for distance-based algorithms such as KNN
- Cross-validation provides a more reliable evaluation of model performance than a single train-test split
- Precision, recall, F1-score, and ROC-AUC provide a more complete evaluation than accuracy alone

**Real-World Outcome**
The project demonstrates how healthcare data can be transformed through feature engineering and preprocessing, then evaluated using multiple machine learning models and performance metrics for cardiovascular disease classification.

**Dataset:** Cardiovascular Disease Dataset (~70,000 patient records)
**Tech Stack:** `Python` · `NumPy` · `Pandas` · `Matplotlib` · `Seaborn` · `Scikit-learn` · `Jupyter Notebook` · `Google Colab`

📂 [`WEEK 09 & 10 (MODEL EVALUATION)/`](<WEEK 09 & 10 (MODEL EVALUATION)>)

---

## 🔍 Week 11 & 12 — Dimensionality Reduction

### Project: Dimensionality Reduction on Bank Marketing Data

**Tasks Implemented**
- Loaded and inspected the Bank Marketing dataset (`bank-full.csv`) from the UCI Machine Learning Repository
- Examined dataset shape, data types, missing values, and target classes
- Performed EDA, including correlation heatmaps, target-class distribution, and box plots
- Encoded categorical variables using one-hot encoding (`drop_first=True`)
- Encoded the target variable `y` using `LabelEncoder`
- Applied feature scaling using `StandardScaler`
- Implemented Principal Component Analysis (PCA): explained/cumulative variance, scree plot, 2D & 3D projections, feature loadings
- Implemented t-SNE on a 5,000-record sample, comparing perplexity values of 5, 30, and 50
- Compared PCA and t-SNE projections

**Real-World Problem**
Bank marketing datasets contain many demographic, financial, and campaign-related variables. Understanding the underlying structure of this high-dimensional data can help visualize customer segments and campaign outcomes without relying on any single pair of raw features.

**Analysis Performed**
- Analysed numerical feature correlations and target-class distribution
- Compared numerical variables across subscription outcomes using box plots
- Standardized the encoded feature matrix prior to dimensionality reduction
- Performed full PCA to study explained and cumulative variance
- Visualized the dataset in 2D and 3D using principal components
- Identified top feature loadings contributing to PC1 and PC2
- Applied t-SNE to a fixed random sample for computational efficiency
- Compared local structure captured by t-SNE across different perplexity values
- Contrasted the linear, variance-based PCA projection with the nonlinear t-SNE projection

**Key Findings**
- The dataset's high-dimensional, one-hot encoded feature space can be meaningfully summarized using a small number of principal components
- Cumulative explained variance and the scree plot indicate how many components are needed to retain most of the dataset's variability
- PCA feature loadings reveal which original variables contribute most strongly to the leading components
- t-SNE reveals local, nonlinear structure in customer data that is not captured by PCA alone
- The perplexity parameter has a noticeable effect on the shape and separation of clusters in the t-SNE projection
- PCA and t-SNE offer complementary views of the same dataset — one variance-based and linear, the other neighbourhood-based and nonlinear

**Real-World Outcome**
The project demonstrates how dimensionality reduction techniques can be used to explore and visualize high-dimensional marketing data, providing an interpretable, lower-dimensional view of customer structure without building a predictive classification model.

**Dataset:** [UCI Bank Marketing Dataset](https://archive.ics.uci.edu/dataset/222/bank+marketing)
**Tech Stack:** `Python` · `NumPy` · `Pandas` · `Matplotlib` · `Seaborn` · `Scikit-learn` · `Google Colab`

📂 [`WEEK 11 & 12 (Dimensionality Reduction)/`](<WEEK 11 & 12 (Dimensionality Reduction)>)

---

## 🌲 Week 13 & 14 — Ensemble Methods & Regularization

### Project: Airline Passenger Satisfaction Classification using Ensemble Methods

A classification project on an airline passenger satisfaction dataset of 25,976 records, used to study ensemble learning (Bagging and Boosting, with a focus on XGBoost and LightGBM), the bias–variance trade-off, overfitting and underfitting, and L1/L2 regularization.

**Tasks Implemented**
- Loaded and inspected the dataset (`test.csv`), including data types, missing values, and summary statistics
- Performed EDA: target-class distribution, numerical feature distributions, correlation heatmap, and categorical feature plots
- Removed the index and `id` columns, encoded categorical variables, and filled missing values using the training-set median only (no data leakage)
- Performed a stratified 60/20/20 train / validation / test split
- Trained a Decision Tree baseline and compared it against Bagging (100 trees), AdaBoost, XGBoost, and LightGBM
- Calculated accuracy, precision, recall, F1-score, and ROC-AUC, and generated confusion matrices and classification reports
- Plotted XGBoost and LightGBM feature importances
- Trained Decision Trees of depth 1 to 25 to study the bias–variance trade-off
- Compared training and validation accuracy to identify underfitting and overfitting
- Varied L1 (`reg_alpha`) and L2 (`reg_lambda`) regularization in XGBoost and compared validation performance
- Built a final comparison of all models and regularization experiments on the test set

**Real-World Problem**
Airlines want to understand which passengers are satisfied and why. A single model can easily memorize its training data, so the project asks how combining models and penalizing complexity change the reliability of predictions on unseen passengers.

**Analysis Performed**
- Compared satisfaction across travel type, class, and customer type
- Examined how service ratings (online boarding, wifi, seat comfort, entertainment) relate to satisfaction
- Compared single-model and ensemble performance on the same test set
- Studied how tree depth affects training and validation accuracy
- Measured the train–validation gap for shallow, best-depth, and fully grown trees
- Compared the effect of L1 and L2 penalties on accuracy, the train–validation gap, and leaf weights

**Key Findings**
- Bagging improved the fully grown Decision Tree's test accuracy from 0.9282 to 0.9542 by averaging many trees
- LightGBM (accuracy 0.9629) and XGBoost (0.9600) scored highest in this run, but the difference is small and comes from a single split, so no algorithm is declared the best
- AdaBoost (accuracy 0.9238) was slightly below the single tree in accuracy, though its ROC-AUC was higher (0.9741 vs 0.9285)
- A depth-1 tree underfit (train 0.7833, validation 0.7790), validation accuracy peaked at depth 10 (0.9369), and a fully grown tree overfit (train 1.0000, validation 0.9311)
- L1 and L2 regularization reduced XGBoost's train–validation gap (from 0.0402 to 0.0136 and 0.0121) but did not improve validation or test accuracy in this experiment

**Real-World Outcome**
The project shows how ensemble methods and regularization can be studied and compared using train / validation / test evidence, and why a model should be judged on validation performance and the train–validation gap rather than training accuracy alone.

**Dataset:** Airline Passenger Satisfaction Dataset (25,976 records, 22 input features)
**Tech Stack:** `Python` · `NumPy` · `Pandas` · `Matplotlib` · `Seaborn` · `Scikit-learn` · `XGBoost` · `LightGBM` · `Google Colab`

📂 [`WEEK 13 & 14 (Ensemble Methods)/`](<WEEK 13 & 14 (Ensemble Methods)>)

---

## 🧮 Week 15 & 16 — Neural Networks from Scratch

### Project: Building a Neural Network from First Principles (NumPy only)

A notebook that builds every component of a neural network by hand — no deep learning framework — starting from saving classical ML models and ending with a reusable `NeuralNetwork` class trained on a nonlinear dataset.

**Tasks Implemented**
- Trained a Logistic Regression on Iris and saved it with `pickle` and `joblib`, verifying that reloaded models give identical predictions
- Implemented a **Perceptron** (weights, bias, step function, learning rule) and taught it the AND gate
- Implemented and plotted the **Sigmoid, ReLU, and Tanh** activation functions
- Implemented **forward propagation** for a 2-layer network (tanh hidden layer, sigmoid output) on the `make_moons` dataset
- Implemented **Binary Cross-Entropy** loss with numerical clipping
- Derived and implemented **backpropagation** with the chain rule, and verified it with numerical **gradient checking**
- Implemented **SGD** and **Adam** optimizers from scratch and compared their loss curves
- Combined everything into a `NeuralNetwork` class (`fit`, `predict_proba`, `predict`, `evaluate`)
- Plotted decision boundaries and generated a confusion matrix
- Saved and restored trained weights as a `.npz` file

**Real-World Problem**
Frameworks hide what a neural network actually does. Rebuilding one piece by piece shows how a model turns inputs into predictions, how errors flow backwards to update weights, and why non-linear layers are needed for problems a straight line cannot solve.

**Analysis Performed**
- Compared pickle and joblib model persistence
- Visualized the perceptron's learned decision boundary
- Compared good, uncertain, and bad predictions under Binary Cross-Entropy
- Compared analytical and numerical gradients for several parameters
- Compared SGD and Adam training loss over 500 epochs
- Evaluated the final network on training and test data

**Key Findings**
- Logistic Regression reached 96.67% test accuracy on Iris, and both pickle and joblib reloads reproduced its predictions exactly
- The perceptron learned the AND gate correctly (weights `[0.2, 0.1]`, bias `-0.2`), but a single neuron can only separate linearly separable data
- Analytical and numerical gradients agreed to about 1e-12, confirming the backpropagation code
- In this run Adam reached a final training loss of 0.0707 versus 0.3414 for SGD, although the two used different learning rates (0.01 and 0.1), so this is not a controlled comparison
- The NumPy network reached 98% training and 93% test accuracy on the moons dataset, with a test confusion matrix of `[[46, 4], [3, 47]]`
- Saved and restored weights produced identical predictions and probabilities

**Real-World Outcome**
A working neural network built entirely from first principles, with every step (forward pass, loss, gradients, optimizer, persistence) understood and verified rather than treated as a black box.

**Datasets:** Iris (`load_iris`) · Moons (`make_moons`, 400 samples, noise 0.2)
**Tech Stack:** `Python` · `NumPy` · `Matplotlib` · `Scikit-learn` · `Joblib` · `Jupyter Notebook`

📂 [`WEEK 15 & 16 (Neural Networks)/`](<WEEK 15 & 16 (Neural Networks)>)

---

## 🔥 Week 17 & 18 — Deep Learning with PyTorch

### Project: Deep Learning, Transfer Learning, Transformers & LLMs

A practical notebook that moves from NumPy to **PyTorch** — tensors and autograd, MLPs and CNNs on image data, regularization, transfer learning with a pretrained MobileNetV3, sentiment analysis with a Hugging Face Transformer, and an opt-in comparison of hosted and local LLMs.

**Tasks Implemented**
- Explored **tensors** (shapes, matrix multiplication, broadcasting) and **autograd**, verifying gradients against the analytical result
- Fitted a linear regression with manual gradient descent and with `nn.Linear` + `SGD`
- Built a **Multi-Layer Perceptron** on the digits dataset, with training/validation curves and a confusion matrix
- Built a **Convolutional Neural Network** (`DigitCNN`), visualized its learned filters and misclassified images
- Tested **Dropout**, **Batch Normalization**, and **Early Stopping** on a deliberately small training set (150 samples)
- Applied **transfer learning**: frozen pretrained MobileNetV3 Small backbone with a new 10-class head
- Ran **sentiment analysis** with DistilBERT using both the `pipeline` API and a manual tokenizer + model workflow
- Built helper functions for four LLM routes (Anthropic API, OpenAI API, local Hugging Face model, Ollama) for text generation, summarization, and question answering, with all paid or heavy calls disabled by default

**Real-World Problem**
Modern image and language tasks rarely start from scratch. Understanding when a small custom network is enough, how to stop it overfitting, and how to reuse pretrained models and APIs responsibly is central to practical deep learning.

**Analysis Performed**
- Compared manual gradient descent with PyTorch's built-in modules
- Compared an MLP and a CNN on the same stratified train / validation / test split (1078 / 359 / 360)
- Compared five regularization setups using test accuracy, minimum validation loss, and the train–validation gap
- Evaluated a transfer-learning head on upscaled, ImageNet-normalized digits
- Inspected tokenization, logits, and softmax confidence for a sentiment model
- Compared hosted APIs and local open models on quality, cost, privacy, and hardware needs

**Key Findings**
- Manual gradient descent and `nn.Linear` + `SGD` both recovered `w = 2.997`, `b = 2.006` for a true line of `y = 3x + 2`
- The MLP (17,226 parameters) scored 96.11% test accuracy and the CNN (13,706 parameters) scored 95.00%; on tiny 8×8 images the convolutions did not beat the MLP
- With only 150 training samples every model reached 100% training accuracy; BatchNorm gave the best test accuracy (0.900) and lowest validation loss (0.2958), while Early Stopping mainly kept validation loss from rising, though these are single-seed runs on a small dataset
- The transfer-learning head (601,098 trainable out of 1,528,106 parameters) reached 88.89% test accuracy after 5 epochs, below the MLP, because digits differ greatly from ImageNet photos
- DistilBERT classified clear positive and negative sentences with confidence above 0.99, but labelled the neutral sentence "The package arrived on Tuesday." as POSITIVE (0.98), since the model is binary and has no neutral class

**Real-World Outcome**
A hands-on view of the modern deep-learning workflow — building and regularizing networks in PyTorch, reusing pretrained models, and choosing between hosted and local LLMs — with API keys kept in environment variables and no paid calls made unless explicitly enabled.

**Datasets:** scikit-learn Digits (1,797 images, 8×8) · SST-2 fine-tuned DistilBERT (`distilbert-base-uncased-finetuned-sst-2-english`) · ImageNet-pretrained MobileNetV3 Small
**Tech Stack:** `Python` · `PyTorch` · `torchvision` · `Hugging Face Transformers` · `NumPy` · `Matplotlib` · `Scikit-learn` · `Jupyter Notebook`

📂 [`WEEK 17 & 18 (Deep Learning)/`](<WEEK 17 & 18 (Deep Learning)>)

---

## 🛠️ Technologies Used

| Week(s) | Technologies |
|---|---|
| 01 | JavaScript, Node.js (`http`), REST API |
| 02 | React, Vite, TypeScript, Tailwind CSS, FastAPI, Supabase (PostgreSQL), NumPy, Pandas, Matplotlib, Seaborn |
| 03 & 04 | Python, NumPy, Pandas, Matplotlib, Seaborn, Jupyter Notebook |
| 05 & 06 | Python, NumPy, OpenCV, Matplotlib, Google Colab |
| 07 & 08 | Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, Jupyter Notebook, Google Colab |
| 09 & 10 | Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, Jupyter Notebook, Google Colab |
| 11 & 12 | Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, Google Colab |
| 13 & 14 | Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, XGBoost, LightGBM, Google Colab |
| 15 & 16 | Python, NumPy, Matplotlib, Scikit-learn, Joblib, Jupyter Notebook |
| 17 & 18 | Python, PyTorch, torchvision, Hugging Face Transformers, NumPy, Matplotlib, Scikit-learn, Jupyter Notebook |

## 🎯 Overall Learning Outcome

The Hack-o-week progression focuses on applying concepts through practical implementation rather than studying them in isolation:

**REST APIs → Full-Stack Product Development → Python & Data Analysis → Linear Algebra & Calculus (Computer Vision) → Regression & Classification → Model Evaluation & Feature Engineering → Dimensionality Reduction → Ensemble Methods & Regularization → Neural Networks from Scratch → Deep Learning, Transfer Learning & Transformers**

The projects move from hand-building a backend API and a production-style full-stack product, to analysing real-world data, to using linear algebra and calculus to detect blood vessels in medical images, to developing and rigorously evaluating machine learning models, to exploring high-dimensional data structure through PCA and t-SNE, to combining models with Bagging and Boosting while controlling overfitting through the bias–variance trade-off and L1/L2 regularization, and finally to rebuilding a neural network from first principles in NumPy and then scaling up to PyTorch, CNNs, transfer learning, Transformers, and LLMs.

---

<div align="center">

*Built as part of the Semester V Hack-o-week program.*

</div>
