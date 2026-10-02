# HACKOWEEK Week 13 & 14 — Ensemble Methods, Bias–Variance Trade-off and Regularization on Airline Passenger Satisfaction Data

## Project Overview

This project applies **ensemble learning methods** to the Airline Passenger Satisfaction dataset. The main objective is to study and implement **Bagging**, **Boosting (AdaBoost)**, **XGBoost** and **LightGBM**, and to understand the **bias–variance trade-off**, **overfitting and underfitting**, and **L1/L2 regularization** through experiments.

The notebook focuses on data inspection, exploratory data analysis, preprocessing, model training and evaluation, model comparison, decision-tree depth experiments, and regularization experiments using XGBoost.

## Dataset

The project uses the **Airline Passenger Satisfaction** dataset provided as `test.csv`.

The dataset contains **25,976 passenger records** and **25 columns** (passenger details, travel details, 14 service ratings and delay information). The target variable `satisfaction` indicates the passenger's satisfaction level.

* `satisfied` — passenger was satisfied (43.9%)
* `neutral or dissatisfied` — passenger was neutral or dissatisfied (56.1%)

Although the file is named `test.csv`, it contains the `satisfaction` label for every row and has enough records for a proper evaluation. It is therefore used as the only dataset and is split into training, validation and test sets inside the notebook.

The notebook loads the `test.csv` file using Pandas.

## Topics Covered
* Ensemble Learning
* Bagging
* Boosting
* AdaBoost
* XGBoost
* LightGBM
* Bias and Variance
* Bias–Variance Trade-off
* Overfitting and Underfitting
* L1 Regularization (`reg_alpha`)
* L2 Regularization (`reg_lambda`)
* Data Loading and Dataset Inspection
* Data Types and Missing Value Analysis
* Exploratory Data Analysis (EDA)
* Target Variable Distribution
* Numerical Feature Distributions
* Correlation Analysis
* Categorical Feature Analysis
* Categorical Feature Encoding
* Target Variable Encoding
* Stratified Train / Validation / Test Split
* Median Imputation without Data Leakage
* Baseline Decision Tree
* Evaluation Metrics (Accuracy, Precision, Recall, F1-score, ROC-AUC)
* Confusion Matrix and Classification Report
* Feature Importance
* Model Comparison
* Decision Tree Depth vs Training and Validation Accuracy
* Train–Validation Gap Analysis
* Regularization Strength Experiments
* L1 vs L2 Comparison
* Reproducible Analysis using Random State

## Technologies and Libraries

* Python
* Google Colab
* NumPy
* Pandas
* Matplotlib
* Seaborn
* Scikit-learn
* XGBoost
* LightGBM

## Methodology

### 1. Data Loading

The `test.csv` dataset is loaded into a Pandas DataFrame. If the file is not found in the Colab session, the notebook prompts for an upload.

### 2. Data Inspection

The notebook examines:

* Dataset shape
* Initial records
* Column names
* Data types
* Missing values
* Basic statistical summary

### 3. Exploratory Data Analysis

The notebook includes:

* Target-class distribution
* Histograms of Age, Flight Distance, Departure Delay and Arrival Delay grouped by satisfaction
* Correlation heatmap for numerical features
* Count plots of Gender, Customer Type, Type of Travel and Class grouped by satisfaction
* Share of satisfied passengers by selected service ratings

### 4. Data Preprocessing

The unnamed index column and the `id` column are removed.

The target variable `satisfaction` is converted into numerical labels (`satisfied` = 1, `neutral or dissatisfied` = 0).

Categorical variables are encoded: `Gender`, `Customer Type` and `Type of Travel` are mapped to 0/1, and `Class` is mapped to an ordered scale (Eco, Eco Plus, Business).

The data is split into **60% training, 20% validation and 20% test** sets using stratification (15,585 / 5,195 / 5,196 records).

The only column with missing values, `Arrival Delay in Minutes` (83 values), is filled with the median learned from the **training set only**, to avoid data leakage.

Feature scaling is not applied because all models used are tree-based and are not affected by feature scale.

The validation set is used for the depth and regularization experiments. The test set is used for the model comparison.

## Ensemble Model Analysis

The following models are trained on the training set and evaluated on the test set:

1. Decision Tree (baseline, fully grown)
2. Bagging Classifier (100 Decision Trees)
3. AdaBoost (200 depth-1 trees, learning rate 0.5)
4. XGBoost (300 trees, learning rate 0.1, max depth 6, subsample 0.8, colsample_bytree 0.8)
5. LightGBM (300 trees, learning rate 0.1, 31 leaves, subsample 0.8, colsample_bytree 0.8)

All models use random state 42.

Each model is evaluated using:

* Accuracy
* Precision
* Recall
* F1-score
* ROC-AUC
* Confusion matrix
* Classification report

Feature importance is displayed for XGBoost and LightGBM.

## Bias–Variance and Overfitting Analysis

Decision Trees with `max_depth` from 1 to 25 are trained, and training and validation accuracy are plotted against tree depth.

Three trees of different complexity are then compared using their train–validation gap:

* `max_depth = 1`
* the best validation depth (`max_depth = 10`)
* no depth limit (`max_depth = None`)

## Regularization Analysis

XGBoost is trained with several values of the regularization parameters while all other settings are kept fixed:

* L1 regularization: `reg_alpha` = 0, 0.1, 1, 5, 10, 50
* L2 regularization: `reg_lambda` = 0, 1, 10, 50, 100, 500

The notebook compares training accuracy, validation accuracy, train–validation gap, validation F1-score, validation ROC-AUC and the mean absolute leaf weight.

The regularization values used in the final comparison are the strongest settings whose validation accuracy stays within 0.5 percentage points of the best validation accuracy (`reg_alpha = 10`, `reg_lambda = 100`).

## Results

Test-set performance from the executed notebook:

| Model | Accuracy | Precision | Recall | F1-score | ROC-AUC |
|---|---|---|---|---|---|
| Decision Tree | 0.9282 | 0.9077 | 0.9312 | 0.9193 | 0.9285 |
| Bagging | 0.9542 | 0.9538 | 0.9413 | 0.9475 | 0.9913 |
| AdaBoost | 0.9238 | 0.9187 | 0.9066 | 0.9126 | 0.9741 |
| XGBoost | 0.9600 | 0.9617 | 0.9465 | 0.9540 | 0.9940 |
| LightGBM | 0.9629 | 0.9677 | 0.9470 | 0.9572 | 0.9944 |
| XGBoost + best L1 (`reg_alpha = 10`) | 0.9575 | 0.9602 | 0.9421 | 0.9511 | 0.9935 |
| XGBoost + best L2 (`reg_lambda = 100`) | 0.9567 | 0.9597 | 0.9408 | 0.9502 | 0.9932 |
| XGBoost + best L1 & L2 | 0.9550 | 0.9579 | 0.9386 | 0.9482 | 0.9922 |

Decision Tree depth experiment (training vs validation accuracy):

| Tree | Train accuracy | Validation accuracy | Gap |
|---|---|---|---|
| `max_depth = 1` | 0.7833 | 0.7790 | 0.0042 |
| `max_depth = 10` | 0.9576 | 0.9369 | 0.0207 |
| `max_depth = None` | 1.0000 | 0.9311 | 0.0689 |

Key observations:

* Bagging improved on the single Decision Tree in accuracy, F1-score and ROC-AUC.
* AdaBoost had a slightly lower accuracy than the single tree, although its ROC-AUC was higher.
* LightGBM and XGBoost had the highest scores in this run, but the difference between them is small.
* A fully grown Decision Tree reached a training accuracy of 1.0 against a validation accuracy of 0.9311, showing overfitting. A tree with `max_depth = 1` underfit. The best validation accuracy (0.9369) occurred at `max_depth = 10`.
* L1 and L2 regularization reduced the train–validation gap of XGBoost (from 0.0402 to 0.0136 and 0.0121) but did not improve validation or test accuracy in this experiment.
* The most important features were `Type of Travel`, `Online boarding`, `Class`, `Inflight wifi service` and `Customer Type` for XGBoost, and `Online boarding`, `Inflight wifi service`, `Type of Travel`, `Class` and `Inflight entertainment` for LightGBM.

## Visualizations

The notebook generates several visualizations, including:

* Target-class distribution
* Numerical-feature distributions
* Correlation heatmap
* Categorical feature count plots
* Share of satisfied passengers by service rating
* Confusion matrix for each model
* XGBoost feature importance
* LightGBM feature importance
* Model performance comparison bar chart
* Decision tree depth vs training and validation accuracy
* Training vs validation accuracy and train–validation gap plots
* L1 regularization effect plots
* L2 regularization effect plots
* L1 vs L2 comparison plots
* Final comparison of all models

## Project Structure

```text
HACKOWEEK_WEEK_13_&_14/
│
├── HACKOWEEK_WEEK_13_&_14.ipynb
├── test.csv
└── README.md
```

## How to Run

### Using Google Colab

1. Open the notebook in Google Colab.
2. Run the cells from top to bottom. The first cell installs XGBoost and LightGBM.
3. When prompted, upload `test.csv` to the Colab session (or place it in the session beforehand).
4. The notebook will perform preprocessing, model training, evaluation, and the bias–variance and regularization experiments.

### Using Jupyter Notebook

Install the required libraries:

```bash
pip install numpy pandas matplotlib seaborn scikit-learn xgboost lightgbm
```

Place `test.csv` in the same working directory as the notebook and run all cells.

## Important Notes

* All metrics and tables come from actually running the notebook.
* Preprocessing steps that learn from data (median imputation) are fitted on the training set only, to avoid data leakage.
* The random seed is set to 42 for reproducibility of the data split and model configurations.
* Hyperparameters are sensible values and were not extensively tuned.
* Results depend on a single train/validation/test split, so small differences between the top models should not be treated as a definite ranking.
* The notebook does not claim that any one algorithm is the best.

## Conclusion

This project demonstrates how ensemble methods improve on a single Decision Tree. Bagging reduces variance by combining many independently trained trees, while boosting builds models sequentially to correct earlier errors. XGBoost and LightGBM, two gradient boosting methods, gave the highest scores in this run.

The tree-depth experiment shows how model complexity affects generalization: very shallow trees underfit, very deep trees overfit, and the train–validation gap grows with complexity. The L1 and L2 experiments show that regularization reduces the gap and controls model complexity, although in this dataset it did not increase accuracy.
