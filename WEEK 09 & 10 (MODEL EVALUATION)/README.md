# WEEK 9 & 10 — MODEL EVALUATION & FEATURE ENGINEERING

This repository contains the implementation of Model Evaluation and Feature Engineering concepts covered during Hack-o-week Week 9 & 10.

## Topics Covered

### Model Evaluation
- Train-Test Split
- Cross-Validation
- Confusion Matrix
- Precision
- Recall
- F1-Score
- ROC-AUC
- ROC Curve
- Precision-Recall Curve
- Classification Report
- Model Comparison

### Feature Engineering & Preprocessing
- Feature Creation
- Feature Transformation
- Categorical Encoding
- Feature Scaling
- StandardScaler
- Missing Data Detection
- Missing Data Handling
- Data Preprocessing

## Project

### Cardiovascular Disease Prediction

A real-world machine learning project based on a cardiovascular disease dataset containing approximately 70,000 patient records.

The dataset contains demographic, physical, lifestyle, and health-related attributes such as age, gender, height, weight, blood pressure, cholesterol, glucose, smoking, alcohol consumption, and physical activity.

The project focuses on preparing healthcare data, engineering meaningful features, and evaluating classification models using multiple performance measures.

## Tasks Implemented

- Loaded and explored the cardiovascular disease dataset
- Analysed dataset structure and data types
- Checked for missing values and duplicate records
- Analysed the target class distribution
- Performed exploratory data analysis
- Created meaningful engineered features
- Converted age into years and age groups
- Calculated BMI from height and weight
- Derived pulse pressure from blood pressure measurements
- Encoded categorical variables
- Handled missing data where required
- Applied feature scaling using StandardScaler
- Performed train-test split
- Used stratified sampling for classification
- Implemented Logistic Regression
- Implemented K-Nearest Neighbors (KNN)
- Implemented Decision Tree
- Implemented Random Forest
- Performed 5-fold cross-validation
- Generated confusion matrices
- Calculated precision, recall, F1-score, and ROC-AUC
- Generated ROC and Precision-Recall curves
- Compared classification models

## Real-World Problem

Cardiovascular disease is influenced by multiple demographic, physical, and lifestyle-related factors.

Machine learning can be used to analyse these factors and classify whether a patient belongs to a cardiovascular disease category.

Reliable model evaluation is important because a medical classification model should not be judged only by its accuracy.

## Analysis Performed

- Analysed cardiovascular disease distribution
- Studied age and cardiovascular disease relationships
- Analysed blood pressure patterns
- Compared cholesterol and glucose levels across outcomes
- Investigated BMI and cardiovascular disease
- Studied smoking, alcohol consumption, and physical activity
- Examined correlations between health-related variables
- Identified potential outliers
- Created additional features from existing measurements
- Compared model performance using cross-validation
- Evaluated models using precision, recall, F1-score, and ROC-AUC
- Analysed classification errors using confusion matrices
- Compared ROC and Precision-Recall curves

## Key Findings

- Demographic, physical, and health-related variables provide useful information for cardiovascular disease classification.
- Age and blood pressure measurements show important patterns across cardiovascular disease outcomes.
- BMI provides an additional representation of height and weight information.
- Pulse pressure provides an engineered representation derived from systolic and diastolic blood pressure.
- Feature scaling is particularly important for distance-based algorithms such as KNN.
- Cross-validation provides a more reliable estimate of model performance than a single train-test split.
- Confusion matrices help identify false-positive and false-negative predictions.
- Precision, recall, F1-score, and ROC-AUC provide a more complete evaluation of classification performance.
- ROC and Precision-Recall curves provide additional insight into model behaviour across different classification thresholds.

The exact numerical performance values are generated from the dataset when the notebook is executed.

## Real-World Outcome

The project demonstrates how feature engineering, preprocessing, scaling, cross-validation, and multiple evaluation metrics can be combined to develop and assess machine learning models for cardiovascular disease classification.

## Technologies Used

- Python
- NumPy
- Pandas
- Matplotlib
- Seaborn
- Scikit-learn
- Jupyter Notebook
- Google Colab

## Dataset

Cardiovascular Disease Dataset

Approximately 70,000 patient records containing demographic, physical, lifestyle, and health-related attributes.

## Objective

To apply feature engineering, data preprocessing, scaling, cross-validation, and model evaluation techniques to a real-world healthcare dataset and understand how different classification models perform using multiple evaluation metrics.
