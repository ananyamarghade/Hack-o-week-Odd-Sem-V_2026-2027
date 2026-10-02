# Ensemble Methods on Airline Passenger Satisfaction

Bagging, boosting (AdaBoost, XGBoost, LightGBM), the bias–variance trade-off and L1/L2 regularization, demonstrated on a passenger satisfaction classification task.

**Notebook:** `Ensemble_Methods_Airline_Satisfaction.ipynb` (runs on Google Colab, executed end to end with no errors)

---

## At a Glance

| | |
|---|---|
| **Task** | Binary classification of `satisfaction` |
| **Data** | `test.csv`, 25,976 passengers, 22 input features |
| **Classes** | satisfied 43.9%, neutral or dissatisfied 56.1% |
| **Split** | 60% train / 20% validation / 20% test, stratified, `random_state=42` |
| **Models** | Decision Tree, Bagging, AdaBoost, XGBoost, LightGBM |
| **Metrics** | Accuracy, Precision, Recall, F1-score, ROC-AUC, confusion matrix |

The file is named `test.csv`, but it contains the label for every row and is large enough for a proper evaluation, so it is the only dataset used and is split inside the notebook.

---

## What the Notebook Covers

1. Theory: ensemble learning, bagging, boosting, XGBoost, LightGBM, bias, variance, overfitting, underfitting, L1 and L2 regularization
2. Data loading and inspection
3. Exploratory data analysis
4. Preprocessing
5. Baseline Decision Tree
6. Bagging
7. AdaBoost
8. XGBoost with feature importance
9. LightGBM with feature importance
10. Model comparison
11. Bias–variance trade-off (tree depth 1 to 25)
12. Overfitting and underfitting analysis
13. L1 regularization (`reg_alpha`)
14. L2 regularization (`reg_lambda`)
15. L1 vs L2 comparison
16. Final model comparison and conclusion

---

## Preprocessing

- Dropped the unnamed index column and `id`
- Target encoded as satisfied = 1, neutral or dissatisfied = 0
- `Gender`, `Customer Type`, `Type of Travel` mapped to 0/1; `Class` mapped to an ordered scale (Eco, Eco Plus, Business)
- `Arrival Delay in Minutes` (83 missing values) filled with the median computed from the training set only, so there is no data leakage
- No feature scaling, because every model used is tree-based

The validation set is used for the depth and regularization experiments. The test set is used only for comparing models.

---

## Results

### Model comparison (test set)

| Model | Accuracy | Precision | Recall | F1-score | ROC-AUC |
|---|---|---|---|---|---|
| Decision Tree | 0.9282 | 0.9077 | 0.9312 | 0.9193 | 0.9285 |
| Bagging | 0.9542 | 0.9538 | 0.9413 | 0.9475 | 0.9913 |
| AdaBoost | 0.9238 | 0.9187 | 0.9066 | 0.9126 | 0.9741 |
| XGBoost | 0.9600 | 0.9617 | 0.9465 | 0.9540 | 0.9940 |
| LightGBM | 0.9629 | 0.9677 | 0.9470 | 0.9572 | 0.9944 |

### Bias–variance (Decision Tree depth)

| Tree | Train accuracy | Validation accuracy | Gap |
|---|---|---|---|
| `max_depth=1` | 0.7833 | 0.7790 | 0.0042 |
| `max_depth=10` (best validation) | 0.9576 | 0.9369 | 0.0207 |
| `max_depth=None` | 1.0000 | 0.9311 | 0.0689 |

### Regularization (XGBoost, validation set)

| Setting | Train accuracy | Validation accuracy | Gap |
|---|---|---|---|
| No L1 (`reg_alpha=0`), default L2 | 0.9967 | 0.9565 | 0.0402 |
| `reg_alpha=10` | 0.9682 | 0.9546 | 0.0136 |
| `reg_lambda=100` | 0.9655 | 0.9534 | 0.0121 |

### Final comparison (test set)

| Model | Accuracy | F1-score | ROC-AUC |
|---|---|---|---|
| XGBoost | 0.9600 | 0.9540 | 0.9940 |
| XGBoost + L1 (`reg_alpha=10`) | 0.9575 | 0.9511 | 0.9935 |
| XGBoost + L2 (`reg_lambda=100`) | 0.9567 | 0.9502 | 0.9932 |
| XGBoost + L1 and L2 | 0.9550 | 0.9482 | 0.9922 |

---

## Key Findings

- Bagging raised accuracy from 0.9282 (single tree) to 0.9542 by averaging many trees.
- LightGBM and XGBoost scored highest in this run, but the gap between them is small and comes from one split and one seed, so no ranking is claimed.
- AdaBoost's accuracy was slightly below the single tree, although its ROC-AUC was higher.
- A fully grown tree overfits (train 1.000 vs validation 0.931). A depth-1 tree underfits (about 0.78 on both). Validation accuracy peaks at depth 10.
- L1 and L2 regularization shrank XGBoost's train–validation gap from 0.040 to about 0.012 to 0.014, but did not improve validation or test accuracy here.
- The regularization values were chosen as the strongest setting within 0.5 percentage points of the best validation accuracy, because the unregularized default was itself the best on validation.

---

## Run It

### Google Colab

1. Upload the notebook to Colab.
2. Run all cells. The first code cell installs XGBoost and LightGBM.
3. When prompted, upload `test.csv` (or the zip containing it), unless it is already in the session.

### Locally

```bash
pip install numpy pandas matplotlib seaborn scikit-learn xgboost lightgbm
jupyter notebook Ensemble_Methods_Airline_Satisfaction.ipynb
```

Keep `test.csv` in the same folder as the notebook.

---

## Repository Layout

```
Ensemble_Methods_Airline_Satisfaction/
├── Ensemble_Methods_Airline_Satisfaction.ipynb
├── test.csv
└── README.md
```

---

## Notes and Limitations

- Every number above was produced by running the notebook. Nothing is estimated or copied from elsewhere.
- Results rely on a single train/validation/test split with `random_state=42`. Cross-validation would give a more reliable comparison.
- Hyperparameters are sensible defaults, not extensively tuned.
- Code cells contain no comments; explanations are in Markdown cells.

## Libraries

Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, XGBoost, LightGBM
