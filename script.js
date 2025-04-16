//
//** 🌟1. Sélection des éléments HTML
//

const totalAmount = document.getElementById("totalAmount");
const userAmount = document.getElementById("userAmount");
const checkAmountButton = document.getElementById("checkAmountBtn");
const totalAmountButton = document.getElementById("totalAmountBtn");
const productTitle = document.getElementById("productTitle");
const expenditureValue = document.getElementById("expenditureValue");
const balanceAmount = document.getElementById("balanceAmount");
const amount = document.getElementById("Amount");
const list = document.getElementById("list");

//
//** 🏦 2. Variables pour stocker les données
//

function saveToLocalStorage() {
  localStorage.setItem("budget", JSON.stringify(budget));
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

let budget = 0;
let expenses = [];

//
//** 📊 3. Fonction pour mettre à jour l'affichage du budget
//

function updateBudgetDisplay() {
  let totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  expenditureValue.innerText = `${totalExpenses}€`;
  balanceAmount.innerText = `${budget - totalExpenses}€`;
  amount.innerText = `${budget}€`;

  if (budget - totalExpenses < 0) {
    balanceAmount.style.color = "red";
  } else {
    balanceAmount.style.color = "";
  }
  saveToLocalStorage();
}

//
//** ➕ 4. Ajouter ou modifier les revenus
//

totalAmountButton.addEventListener("click", () => {
  let value = parseFloat(totalAmount.value);
  if (isNaN(value) || value < 0) {
    alert("Veuillez entrer un revenu valide !");
    return;
  }
  budget = value;
  updateBudgetDisplay();
  totalAmount.value = "";
});

//
//** ➕ 5. Ajouter une dépense
//

checkAmountButton.addEventListener("click", () => {
  const title = productTitle.value.trim();
  const value = parseFloat(userAmount.value);

  if (title === "" || isNaN(value) || value < 0) {
    alert("Entrez un nom de dépense valide et un montant positif.");
    return;
  }

  const expense = {
    id: Date.now(),
    title: title,
    amount: value,
  };

  expenses.push(expense);
  addExpenseToDOM(expense);
  updateBudgetDisplay();

  productTitle.value = "";
  userAmount.value = "";
});

//
//** 🧱 6. Afficher une dépense dans la page HTML
//

function addExpenseToDOM(expense) {
  const item = document.createElement("div");
  item.className = "expenseItem";
  item.setAttribute("data-id", expense.id);
  item.innerHTML = `
    <span>${expense.title} - ${expense.amount}€</span>
    <button class="edit">✏️</button>
    <button class="delete">🗑️</button>
  `;
  list.appendChild(item);

  function refreshList() {
    list.innerHTML = "";
    expenses.forEach(addExpenseToDOM);
  }
  
  //
  //** 📝 7. Modifier une dépense
  //

  item.querySelector(".edit").addEventListener("click", () => {
    const newTitle = prompt("Modifier le nom de la dépense :", expense.title);
    const newAmount = parseFloat(
      prompt("Modifier le montant :", expense.amount)
    );
    if (newTitle && !isNaN(newAmount) && newAmount >= 0) {
      expense.title = newTitle;
      expense.amount = newAmount;
      item.querySelector("span").innerText = `${newTitle} - ${newAmount}€`;
      updateBudgetDisplay();
    } else {
      alert("Valeurs invalides !");
    }
  });

  //
  //** ❌ 8. Supprimer une dépense
  //

  item.querySelector(".delete").addEventListener("click", () => {
    expenses = expenses.filter((e) => e.id !== expense.id);
    item.remove();
    updateBudgetDisplay();
  });
}


//
//** 🏷️ 9. Charger les données depuis le stockage local
//

window.addEventListener("DOMContentLoaded", () => {
  const savedBudget = localStorage.getItem("budget");
  const savedExpenses = localStorage.getItem("expenses");
  if (savedBudget) budget = JSON.parse(savedBudget);
  if (savedExpenses) expenses = JSON.parse(savedExpenses);
  refreshList();
  updateBudgetDisplay();
});

document.getElementById("exportCSV").addEventListener("click", () => {
  let csvContent = "Nom,Dépense (euros)\n";
  expenses.forEach((exp) => {
    csvContent += `${exp.title},${exp.amount}\n`;
  });
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "depenses.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document.getElementById("exportPDF").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Liste des Dépenses", 10, 10);
  let y = 20;
  expenses.forEach((exp, index) => {
    doc.text(`${index + 1}. ${exp.title} - ${exp.amount}€`, 10, y);
    y += 10;
  });
  doc.save("depenses.pdf");
});
