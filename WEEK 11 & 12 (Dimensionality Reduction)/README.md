# HACKOWEEK Week 11 & 12 — Dimensionality Reduction on Bank Marketing Data

## Project Overview

This project applies **dimensionality reduction techniques** to the Bank Marketing dataset from a Portuguese banking institution. The main objective is to explore the structure of the dataset and visualize high-dimensional customer information in lower-dimensional spaces using **PCA (Principal Component Analysis)** and **t-SNE (t-distributed Stochastic Neighbor Embedding)**.

The notebook focuses on data inspection, preprocessing, feature encoding, scaling, PCA analysis, t-SNE visualization, feature loadings, and comparison of different t-SNE perplexity values.

## Dataset

The project uses the **Bank Marketing Dataset** from the UCI Machine Learning Repository.

The dataset contains information collected during direct marketing campaigns conducted through phone calls. The target variable `y` indicates whether a client subscribed to a bank term deposit.

* `yes` — client subscribed to a term deposit
* `no` — client did not subscribe to a term deposit

Dataset source:

https://archive.ics.uci.edu/dataset/222/bank+marketing

The notebook loads the `bank-full.csv` file using semicolon (`;`) separation.

## Topics Covered
* Introduction to Dimensionality Reduction
* Bank Marketing Dataset Analysis
* Data Loading and Dataset Inspection
* Data Types and Missing Value Analysis
* Exploratory Data Analysis (EDA)
* Numerical Feature Analysis
* Categorical Feature Analysis
* Correlation Analysis
* Target Variable Distribution
* Data Visualization
* Categorical Feature Encoding
* Target Variable Encoding
* Feature Scaling using StandardScaler
* Principal Component Analysis (PCA)
* Explained Variance Ratio
* Cumulative Explained Variance
* Scree Plot
* 2D PCA Visualization
* 3D PCA Visualization
* PCA Feature Loadings
* t-SNE (t-distributed Stochastic Neighbor Embedding)
* t-SNE 2D Visualization
* t-SNE Perplexity
* Comparison of Different Perplexity Values
* PCA vs t-SNE Visualization
* Interpretation of Dimensionality Reduction Results
* Reproducible Analysis using Random State

## Technologies and Libraries

* Python
* Google Colab
* NumPy
* Pandas
* Matplotlib
* Seaborn
* Scikit-learn

## Methodology

### 1. Data Loading

The `bank-full.csv` dataset is loaded into a Pandas DataFrame.

### 2. Data Inspection

The notebook examines:

* Dataset shape
* Initial records
* Data types
* Missing values
* Target classes
* Feature types

### 3. Exploratory Data Analysis

The notebook includes:

* Correlation heatmap for numerical features
* Target-class distribution
* Box plots for selected numerical features grouped by subscription outcome

### 4. Feature Encoding

Categorical input variables are converted into numerical variables using one-hot encoding with `drop_first=True`.

The target variable `y` is converted into numerical labels using `LabelEncoder`.

### 5. Feature Scaling

The encoded feature matrix is standardized using `StandardScaler`.

This produces features with approximately:

* Mean = 0
* Standard deviation = 1

Scaling is important because PCA and t-SNE are distance/variance-sensitive techniques.

## PCA Analysis

Principal Component Analysis is applied to the standardized feature matrix.

The notebook performs:

1. Full PCA to obtain explained variance ratios
2. Cumulative explained variance analysis
3. Scree plot generation
4. 2D PCA projection
5. PCA feature-loading analysis
6. 3D PCA projection

The 2D PCA representation uses two principal components to visualize the dataset according to the target classes.

The notebook also identifies the top feature loadings contributing to PC1 and PC2.

## t-SNE Analysis

t-SNE is used to create a two-dimensional representation of the data.

Because t-SNE is computationally more expensive, a random sample of **5,000 records** is selected using a fixed random seed of 42.

The primary t-SNE configuration uses:

* Components: 2
* Perplexity: 30
* Random state: 42
* Initialization: PCA
* Learning rate: auto

The notebook additionally compares t-SNE projections using perplexity values:

* 5
* 30
* 50

This allows the effect of the perplexity parameter on the resulting visualization to be examined.

## Visualizations

The notebook generates several visualizations, including:

* Numerical-feature correlation heatmap
* Target-class distribution
* Box plots of selected numerical variables
* Cumulative explained variance plot
* PCA scree plot
* 2D PCA projection
* 2D t-SNE projection
* PCA feature-loading heatmap
* 3D PCA projection
* t-SNE perplexity comparison

## Project Structure

```text
HACKOWEEK_WEEK_11_&_12/
│
├── HACKOWEEK_WEEK_11_&_12.ipynb
├── bank-full.csv
└── README.md
```

## How to Run

### Using Google Colab

1. Open the notebook in Google Colab.
2. Upload `bank-full.csv` to the Colab session.
3. Run the cells from top to bottom.
4. The notebook will perform preprocessing, PCA analysis, t-SNE analysis, and visualization.

The notebook expects the dataset at:

```text
/content/bank-full.csv
```

### Using Jupyter Notebook

Install the required libraries:

```bash
pip install numpy pandas matplotlib seaborn scikit-learn
```

Place `bank-full.csv` in the working directory and update the dataset path in the notebook if required.

## Important Notes

* PCA is performed on the standardized one-hot encoded feature matrix.
* t-SNE is performed on a 5,000-record sample rather than the complete dataset.
* The random seed is set to 42 for reproducibility of sampling and dimensionality-reduction configurations.
* PCA and t-SNE are used primarily for dimensionality reduction and visualization in this notebook.
* The notebook does not present a predictive classification model or claim classification performance metrics.

## Conclusion

This project demonstrates how dimensionality reduction can be used to study a high-dimensional tabular dataset. PCA provides a variance-based linear projection and allows feature contributions to be examined through component loadings, while t-SNE provides a nonlinear visualization of local data structure.

The comparison of PCA and t-SNE projections, along with the analysis of different t-SNE perplexity values, provides a practical understanding of how different dimensionality-reduction techniques represent complex tabular data.

