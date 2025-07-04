const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll('.filter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let dragSrcIndex = null;

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const filtered = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement('li');
    li.draggable = true;
    li.className = task.completed ? 'completed' : '';
    li.ondragstart = () => dragSrcIndex = index;
    li.ondragover = (e) => e.preventDefault();
    li.ondrop = () => {
      const dragged = tasks.splice(dragSrcIndex, 1)[0];
      tasks.splice(index, 0, dragged);
      saveTasks();
      renderTasks();
    };

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';
    taskDetails.onclick = () => toggleTask(index);

    const taskText = document.createElement('div');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    const taskDeadline = document.createElement('div');
    taskDeadline.className = 'task-deadline';
    if (task.deadline) {
      taskDeadline.textContent = 'Due: ' + task.deadline;
    }

    taskDetails.appendChild(taskText);
    taskDetails.appendChild(taskDeadline);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.appendChild(delBtn);

    li.appendChild(taskDetails);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;
  if (text === '') return;
  tasks.push({ text, completed: false, deadline });
  taskInput.value = '';
  deadlineInput.value = '';
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function clearAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();