<div align="center">

#  Hack-o-week — Semester V

**A journey from a raw Node.js API to a manually-trained neural network, told through real-world projects.**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-F7931E?style=flat&logo=scikit-learn&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=flat&logo=jupyter&logoColor=white)

</div>

---

## 📖 About

This repository documents twelve weeks of practical implementation completed during the Semester V **Hack-o-week** program — six sprints, each pairing a technical skill set with a real-world dataset or product build. The work moves from a hand-rolled REST API, to a full-stack product, through classic data analysis and ML, and into computer vision and unsupervised learning.

> **Progression:** REST APIs → Full-Stack Product → Data Analysis → Linear Algebra & Calculus → Regression & Classification → Model Evaluation → Dimensionality Reduction

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

## 🎯 Overall Learning Outcome

The Hack-o-week progression focuses on applying concepts through practical implementation rather than studying them in isolation:

**REST APIs → Full-Stack Product Development → Python & Data Analysis → Linear Algebra & Calculus (Computer Vision) → Regression & Classification → Model Evaluation & Feature Engineering → Dimensionality Reduction**

The projects move from hand-building a backend API and a production-style full-stack product, to analysing real-world data, to using linear algebra and calculus to detect blood vessels in medical images and train a neural network from scratch, to developing and rigorously evaluating machine learning models, and finally to exploring high-dimensional data structure through PCA and t-SNE.

---

<div align="center">

*Built as part of the Semester V Hack-o-week program.*

</div>
