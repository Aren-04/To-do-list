window.addEventListener('DOMContentLoaded', () => {
  // Set current date and time in datetime-local input
  const dateTimeInput = document.getElementById('dateTimeInput');
  if (dateTimeInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    dateTimeInput.value = formattedDateTime;
  }

  // Initialize variables
  let categories = ['Personal', 'Work', 'Shopping'];
  let tasks = [];
  let selectedCategory = categories[0];

  // DOM Elements
  const categorySelect = document.getElementById('categorySelect');
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  const removeCategoryBtn = document.getElementById('removeCategoryBtn');
  const newCategoryInput = document.getElementById('newCategoryInput');

  const taskInput = document.getElementById('taskInput');
  const dateTimeInputField = document.getElementById('dateTimeInput');
  const addTaskBtn = document.getElementById('addTaskBtn');

  const pendingList = document.getElementById('pendingList');
  const completedList = document.getElementById('completedList');

  // Helper to render categories in dropdown
  function renderCategories() {
    categorySelect.innerHTML = '';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
    categorySelect.value = selectedCategory;
  }

  // Helper to render tasks based on selected category
  function renderTasks() {
    // Clear lists
    pendingList.innerHTML = '';
    completedList.innerHTML = '';

    const filteredTasks = tasks.filter(t => t.category === selectedCategory);

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      if (task.completed) {
        li.classList.add('completed');
      }

      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;

      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        renderTasks();
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(task.description));

      // Add date/time display
      if (task.dateTime) {
        const timeSpan = document.createElement('time');
        timeSpan.textContent = ` (${task.dateTime.replace('T', ' ')})`;
        label.appendChild(timeSpan);
      }

      // Category label removed

      li.appendChild(label);

      // Remove button
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '×';
      removeBtn.title = 'Remove task';
      removeBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        renderTasks();
      });
      li.appendChild(removeBtn);

      if (task.completed) {
        completedList.appendChild(li);
      } else {
        pendingList.appendChild(li);
      }
    });
  }

  // Add category
  addCategoryBtn.addEventListener('click', () => {
    const newCat = newCategoryInput.value.trim();
    if (newCat && !categories.includes(newCat)) {
      categories.push(newCat);
      selectedCategory = newCat;
      renderCategories();
      renderTasks();
      newCategoryInput.value = '';
    } else if (categories.includes(newCat)) {
      alert('Category already exists!');
    }
  });

  // Remove selected category
  removeCategoryBtn.addEventListener('click', () => {
    if (categories.length === 1) {
      alert('At least one category is required.');
      return;
    }
    const index = categories.indexOf(selectedCategory);
    if (index > -1) {
      // Remove tasks with this category
      tasks = tasks.filter(t => t.category !== selectedCategory);

      // Remove category
      categories.splice(index, 1);

      // Select new category (previous or first)
      selectedCategory = categories[index - 1] || categories[0];

      renderCategories();
      renderTasks();
    }
  });

  // Category change
  categorySelect.addEventListener('change', (e) => {
    selectedCategory = e.target.value;
    renderTasks();
  });

  // Add task
  addTaskBtn.addEventListener('click', () => {
    const desc = taskInput.value.trim();
    const dateTimeVal = dateTimeInputField.value;
    if (!desc) {
      alert('Please enter a task description.');
      return;
    }
    tasks.push({
      description: desc,
      dateTime: dateTimeVal,
      completed: false,
      category: selectedCategory
    });
    taskInput.value = '';

    // Reset datetime to current time after adding
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    dateTimeInputField.value = `${year}-${month}-${day}T${hours}:${minutes}`;

    renderTasks();
  });

  // Initialize dropdown and task list on page load
  renderCategories();
  renderTasks();
});
