let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";


const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const deadlineInput = document.getElementById("deadlineInput");
const addBtn = document.getElementById("addBtn");


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


addBtn.addEventListener("click", () => {
  const title = taskInput.value.trim();
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;

  if (!title) {
    alert("Task cannot be empty!");
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    priority,
    deadline,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
});


function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleComplete(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}


function getPriorityBadge(priority) {
  if (priority === "Low") return "bg-success";
  if (priority === "Medium") return "bg-warning";
  return "bg-danger";
}


function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filtered = tasks;

  if (currentFilter === "completed") {
    filtered = tasks.filter(t => t.completed);
  } else if (currentFilter === "pending") {
    filtered = tasks.filter(t => !t.completed);
  }

  filtered.forEach(task => {
    const today = new Date().toISOString().split("T")[0];
    const isOverdue = task.deadline && task.deadline < today;

    list.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card p-3 ${isOverdue ? "overdue" : ""}">
          
          <h5 class="${task.completed ? "completed" : ""}">
            ${task.title}
          </h5>

          <span class="badge ${getPriorityBadge(task.priority)} mb-2">
            ${task.priority}
          </span>

          <small>Deadline: ${task.deadline || "N/A"}</small>

          <div class="mt-2">
            <button class="btn btn-success btn-sm" onclick="toggleComplete(${task.id})">✔</button>
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">🗑</button>
          </div>

        </div>
      </div>
    `;
  });

  updateCounter();
}


function updateCounter() {
  document.getElementById("totalCount").innerText = tasks.length;
  document.getElementById("completedCount").innerText =
    tasks.filter(t => t.completed).length;
  document.getElementById("pendingCount").innerText =
    tasks.filter(t => !t.completed).length;
}


function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}


const debouncedFilter = debounce((type) => {
  currentFilter = type;
  renderTasks();
}, 300);


document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    debouncedFilter(btn.dataset.type);
  });
});


document.getElementById("sortPriority").addEventListener("click", () => {
  const order = { High: 3, Medium: 2, Low: 1 };
  tasks.sort((a, b) => order[b.priority] - order[a.priority]);
  renderTasks();
});

document.getElementById("sortDeadline").addEventListener("click", () => {
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  renderTasks();
});

// Initial render
renderTasks();
