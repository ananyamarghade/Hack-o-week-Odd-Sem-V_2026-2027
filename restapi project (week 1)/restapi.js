const http = require("http");
const url = require("url");

const PORT = 5000;

let expenses = [];
let nextId = 1;

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Health", "Entertainment", "Others"];

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function validateExpense(data) {
  if (!data.title || !data.title.trim()) return "Title is required";
  if (!data.amount || Number(data.amount) <= 0) return "Amount must be greater than 0";
  if (!data.category || !CATEGORIES.includes(data.category)) return "Valid category is required";
  if (!data.date) return "Date is required";
  return null;
}

function getExpenses(req, res, query) {
  let result = expenses;

  if (query.search) {
    const term = query.search.toLowerCase();
    result = result.filter((e) => e.title.toLowerCase().includes(term));
  }

  if (query.category && query.category !== "All") {
    result = result.filter((e) => e.category === query.category);
  }

  result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date));

  sendJSON(res, 200, result);
}

async function addExpense(req, res) {
  const data = await readBody(req);
  const error = validateExpense(data);
  if (error) return sendJSON(res, 400, { message: error });

  const expense = {
    _id: String(nextId++),
    title: data.title.trim(),
    amount: Number(data.amount),
    category: data.category,
    date: data.date,
    description: (data.description || "").trim(),
  };

  expenses.push(expense);
  sendJSON(res, 201, expense);
}

async function updateExpense(req, res, id) {
  const data = await readBody(req);
  const error = validateExpense(data);
  if (error) return sendJSON(res, 400, { message: error });

  const index = expenses.findIndex((e) => e._id === id);
  if (index === -1) return sendJSON(res, 404, { message: "Expense not found" });

  expenses[index] = {
    _id: id,
    title: data.title.trim(),
    amount: Number(data.amount),
    category: data.category,
    date: data.date,
    description: (data.description || "").trim(),
  };

  sendJSON(res, 200, expenses[index]);
}

function deleteExpense(req, res, id) {
  const index = expenses.findIndex((e) => e._id === id);
  if (index === -1) return sendJSON(res, 404, { message: "Expense not found" });

  expenses.splice(index, 1);
  sendJSON(res, 200, { message: "Deleted successfully" });
}


function getHomePage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Expense Tracker</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Arial, sans-serif; background:#f7f9fc; color:#2b2f38; padding:20px; }
  h1 { text-align:center; margin-bottom:5px; }
  .subtitle { text-align:center; color:#767c88; margin-bottom:20px; font-size:14px; }
  .container { max-width:800px; margin:0 auto; }

  .summary { display:flex; gap:15px; margin-bottom:20px; }
  .summary-card { flex:1; background:#fff; border:1px solid #e7eaf0; border-radius:12px; padding:15px; text-align:center; }
  .summary-card span { display:block; }
  .summary-card .label { font-size:13px; color:#767c88; }
  .summary-card .value { font-size:20px; font-weight:bold; color:#4a7fd6; margin-top:5px; }

  .form-box { background:#fff; border:1px solid #e7eaf0; border-radius:12px; padding:20px; margin-bottom:20px; }
  .form-box h2 { margin-bottom:15px; font-size:18px; }
  .row { display:flex; gap:10px; margin-bottom:10px; flex-wrap:wrap; }
  .row input, .row select { flex:1; min-width:140px; }
  input, select, textarea {
    padding:8px 10px; border:1px solid #e7eaf0; border-radius:8px; font-size:14px; width:100%;
  }
  textarea { resize:vertical; }
  .error { color:#e2574c; font-size:12px; min-height:14px; display:block; }

  button {
    padding:8px 18px; border:none; border-radius:20px; cursor:pointer; font-weight:bold; font-size:14px;
  }
  .btn-add { background:#4a7fd6; color:#fff; }
  .btn-clear { background:#eef1f6; color:#2b2f38; margin-left:10px; }

  .filters { display:flex; gap:10px; margin-bottom:20px; }
  .filters input { flex:2; }
  .filters select { flex:1; }

  .expense-card {
    background:#fff; border:1px solid #e7eaf0; border-radius:12px; padding:15px; margin-bottom:12px;
  }
  .expense-top { display:flex; justify-content:space-between; }
  .expense-title { font-weight:bold; }
  .expense-amount { color:#3fb98c; font-weight:bold; }
  .expense-meta { font-size:12px; color:#767c88; margin:5px 0; }
  .category-tag { background:#eaf1fd; color:#4a7fd6; padding:2px 8px; border-radius:10px; margin-right:8px; }
  .expense-desc { font-size:13px; color:#767c88; margin-bottom:10px; }
  .btn-edit { background:#e7f8f1; color:#3fb98c; margin-right:8px; padding:5px 12px; font-size:12px; }
  .btn-delete { background:#fdecea; color:#e2574c; padding:5px 12px; font-size:12px; }

  .empty-state { text-align:center; color:#767c88; padding:40px 0; display:none; }
</style>
</head>
<body>

<h1>💰 Expense Tracker</h1>
<p class="subtitle">Keep an eye on where your money goes</p>

<div class="container">

  <div class="summary">
    <div class="summary-card">
      <span class="label">Total Spending</span>
      <span class="value" id="totalSpending">₹0</span>
    </div>
    <div class="summary-card">
      <span class="label">Total Transactions</span>
      <span class="value" id="totalTransactions">0</span>
    </div>
    <div class="summary-card">
      <span class="label">Highest Expense</span>
      <span class="value" id="highestExpense">₹0</span>
    </div>
  </div>

  <div class="form-box">
    <h2 id="formTitle">Add Expense</h2>
    <form id="expenseForm">
      <input type="hidden" id="expenseId" />
      <div class="row">
        <div style="flex:1">
          <input type="text" id="title" placeholder="Title" />
          <span class="error" id="titleError"></span>
        </div>
        <div style="flex:1">
          <input type="number" id="amount" placeholder="Amount" step="0.01" />
          <span class="error" id="amountError"></span>
        </div>
      </div>
      <div class="row">
        <div style="flex:1">
          <select id="category">
            <option value="">Select category</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Health</option>
            <option>Entertainment</option>
            <option>Others</option>
          </select>
          <span class="error" id="categoryError"></span>
        </div>
        <div style="flex:1">
          <input type="date" id="date" />
          <span class="error" id="dateError"></span>
        </div>
      </div>
      <div class="row">
        <textarea id="description" placeholder="Description (optional)" rows="2"></textarea>
      </div>
      <button type="submit" class="btn-add" id="submitBtn">Add Expense</button>
      <button type="button" class="btn-clear" id="clearBtn">Clear</button>
    </form>
  </div>

  <div class="filters">
    <input type="text" id="searchInput" placeholder="🔍 Search by title..." />
    <select id="filterCategory">
      <option value="All">All Categories</option>
      <option>Food</option>
      <option>Travel</option>
      <option>Shopping</option>
      <option>Bills</option>
      <option>Health</option>
      <option>Entertainment</option>
      <option>Others</option>
    </select>
  </div>

  <div id="expenseList"></div>
  <div class="empty-state" id="emptyState">
    <p>🧾 No expenses yet</p>
    <span>Add your first expense above!</span>
  </div>

</div>

<script>
  const form = document.getElementById("expenseForm");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");
  const clearBtn = document.getElementById("clearBtn");

  const expenseId = document.getElementById("expenseId");
  const titleInput = document.getElementById("title");
  const amountInput = document.getElementById("amount");
  const categoryInput = document.getElementById("category");
  const dateInput = document.getElementById("date");
  const descInput = document.getElementById("description");

  const searchInput = document.getElementById("searchInput");
  const filterCategory = document.getElementById("filterCategory");

  const expenseList = document.getElementById("expenseList");
  const emptyState = document.getElementById("emptyState");

  let expenses = [];

  async function loadExpenses() {
    const search = searchInput.value.trim();
    const category = filterCategory.value;
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category !== "All") params.append("category", category);

    const res = await fetch("/api/expenses?" + params.toString());
    expenses = await res.json();
    renderExpenses();
    updateSummary();
  }

  function renderExpenses() {
    expenseList.innerHTML = "";
    if (expenses.length === 0) {
      emptyState.style.display = "block";
      return;
    }
    emptyState.style.display = "none";

    expenses.forEach((exp) => {
      const div = document.createElement("div");
      div.className = "expense-card";
      const dateStr = new Date(exp.date).toLocaleDateString();
      div.innerHTML = \`
        <div class="expense-top">
          <span class="expense-title">\${exp.title}</span>
          <span class="expense-amount">₹\${exp.amount.toFixed(2)}</span>
        </div>
        <div class="expense-meta">
          <span class="category-tag">\${exp.category}</span>\${dateStr}
        </div>
        \${exp.description ? '<div class="expense-desc">' + exp.description + '</div>' : ""}
        <button class="btn-edit" onclick="editExpense('\${exp._id}')">Edit</button>
        <button class="btn-delete" onclick="deleteExpense('\${exp._id}')">Delete</button>
      \`;
      expenseList.appendChild(div);
    });
  }

  function updateSummary() {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const highest = expenses.length ? Math.max(...expenses.map((e) => e.amount)) : 0;
    document.getElementById("totalSpending").textContent = "₹" + total.toFixed(2);
    document.getElementById("totalTransactions").textContent = expenses.length;
    document.getElementById("highestExpense").textContent = "₹" + highest.toFixed(2);
  }

  function validate() {
    let ok = true;
    document.getElementById("titleError").textContent = "";
    document.getElementById("amountError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    document.getElementById("dateError").textContent = "";

    if (!titleInput.value.trim()) {
      document.getElementById("titleError").textContent = "Title is required";
      ok = false;
    }
    if (!amountInput.value || Number(amountInput.value) <= 0) {
      document.getElementById("amountError").textContent = "Amount must be greater than 0";
      ok = false;
    }
    if (!categoryInput.value) {
      document.getElementById("categoryError").textContent = "Category is required";
      ok = false;
    }
    if (!dateInput.value) {
      document.getElementById("dateError").textContent = "Date is required";
      ok = false;
    }
    return ok;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      title: titleInput.value.trim(),
      amount: Number(amountInput.value),
      category: categoryInput.value,
      date: dateInput.value,
      description: descInput.value.trim(),
    };

    const id = expenseId.value;
    const url = id ? "/api/expenses/" + id : "/api/expenses";
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Something went wrong");
      return;
    }

    resetForm();
    loadExpenses();
  });

  function editExpense(id) {
    const exp = expenses.find((e) => e._id === id);
    if (!exp) return;
    expenseId.value = exp._id;
    titleInput.value = exp.title;
    amountInput.value = exp.amount;
    categoryInput.value = exp.category;
    dateInput.value = exp.date.slice(0, 10);
    descInput.value = exp.description || "";
    formTitle.textContent = "Edit Expense";
    submitBtn.textContent = "Update Expense";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteExpense(id) {
    if (!confirm("Delete this expense?")) return;
    await fetch("/api/expenses/" + id, { method: "DELETE" });
    loadExpenses();
  }

  function resetForm() {
    form.reset();
    expenseId.value = "";
    formTitle.textContent = "Add Expense";
    submitBtn.textContent = "Add Expense";
  }

  clearBtn.addEventListener("click", resetForm);
  searchInput.addEventListener("input", loadExpenses);
  filterCategory.addEventListener("change", loadExpenses);

  loadExpenses();
</script>
</body>
</html>
  `;
}


const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  const query = parsed.query;

  if (path === "/api/expenses" && req.method === "GET") {
    return getExpenses(req, res, query);
  }

  if (path === "/api/expenses" && req.method === "POST") {
    return addExpense(req, res);
  }

  if (path.startsWith("/api/expenses/") && req.method === "PUT") {
    const id = path.split("/")[3];
    return updateExpense(req, res, id);
  }

  if (path.startsWith("/api/expenses/") && req.method === "DELETE") {
    const id = path.split("/")[3];
    return deleteExpense(req, res, id);
  }

  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(getHomePage());
  }

  sendJSON(res, 404, { message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
