
const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", function (){ 

    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const tableBody = document.getElementById("taskTableBody");

    const totalCount = document.getElementById("totalCount");
    const completedCount = document.getElementById("completedCount");
    const remainingCount = document.getElementById("remainingCount");

    const filterButtons = document.querySelectorAll(".filter-btn");

    let tasks = []; // STATE
    /* =========================
   DARK MODE TOGGLE
========================= */

const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀ Light Mode";
}

themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = " Dark Mode";
    }
});

    /* =========================
        ADD TASK
    ========================== */
    // function addTask() {
    //     const text = taskInput.value.trim();
    //     if (text === "") {
    //         alert("Please enter a task!");
    //         return;
    //     }

    //     const task = {
    //         id: Date.now(),
    //         text: text,
    //         completed: false
    //     };

    //     tasks.push(task);
    //     taskInput.value = "";
    //     renderTasks(getActiveFilter());
    // }

    async function addTaskToBackend(text) {
    const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ text })
    });

    const newTask = await res.json();
    return newTask;
}

 /* =========================
        RENDER TASKS
    ========================== */
    function renderTasks(filter = "all") {

        tableBody.innerHTML = "";

        let filteredTasks = tasks;

        if (filter === "completed") {
            filteredTasks = tasks.filter(task => task.completed);
        } 
        else if (filter === "pending") {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        filteredTasks.forEach((task, index) => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${task.text}</td>
                <td class="${task.completed ? "done" : "pending"}">
                    ${task.completed ? "Done" : "Pending"}
                </td>
                <td>
                    ${!task.completed ? `<span class="complete" data-id="${task._id}">✔</span>` : ""}
                    <span class="delete" data-id="${task._id}">✖</span>
                </td>
            `;

            tableBody.appendChild(row);
        });

        updateCounter();
    }

    /* =========================
        TOGGLE COMPLETE
    ========================== */
    async function toggleTask(id) {
        tasks = tasks.map(task =>
            task.id == id ? { ...task, completed: true } : task
        );

        renderTasks(getActiveFilter());
    }

//     async function toggleTaskBackend(id) {
//     try {
//         // Call backend to mark task as completed
//         const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
//             method: "PATCH", // PATCH is safer for partial update
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": token
//             },
//             body: JSON.stringify({ completed: true })
//         });

//         if (!res.ok) throw new Error("Failed to update task");

//         // Update local tasks array
//         tasks = tasks.map(task =>
//             task.id == id ? { ...task, completed: true } : task
//         );

//         // Re-render tasks
//         renderTasks(getActiveFilter());

//     } catch (err) {
//         console.error(err);
//         alert("Error updating task. Check backend!");
//     }
// }

// Table click events
// tableBody.addEventListener("click", function (e) {
//     const id = e.target.dataset.id;

//     if (e.target.classList.contains("complete")) {
//         toggleTaskBackend(id); // Call the async backend update
//     }

    // if (e.target.classList.contains("delete")) {
    //     deleteTask(id);
    // }
// });
// tableBody.addEventListener("click", async function (e) {
//     console.log("Clicked:", e.target);

//     const id = e.target.dataset.id;
//     console.log("ID:", id);

//     if (e.target.classList.contains("complete")) {
//         console.log("Complete button clicked");
//         await markTaskComplete(id);
//         loadTasks();
//     }

//     if (e.target.classList.contains("delete")) {
//         console.log("Delete button clicked");
//     }
// });
    /* =========================
    MARK TASK COMPLETE (BACKEND)
========================= */
async function markTaskComplete(id) {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PATCH", // or PATCH depending on your backend
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ completed: true })
    });

    const updatedTask = await res.json();
    return updatedTask;
}

    /* =========================
        DELETE TASK
    ========================== */
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id != id);
        renderTasks(getActiveFilter());
    }

    /* =========================
        UPDATE COUNTER
    ========================== */
    function updateCounter() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        totalCount.textContent = total;
        completedCount.textContent = completed;
        remainingCount.textContent = remaining;
    }

    /* =========================
        GET ACTIVE FILTER
    ========================== */
    function getActiveFilter() {
        return document.querySelector(".filter-btn.active").dataset.filter;
    }

    async function loadTasks() {
    const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
            "Authorization": token
        }
    });

    const data = await res.json();

    tasks = data;              //  update global tasks array
    renderTasks(getActiveFilter());  //  render tasks in table
    
}

    /* =========================
        TABLE CLICK EVENTS
    ========================== */
    // tableBody.addEventListener("click", function (e) {

    //     if (e.target.classList.contains("complete")) {
    //         toggleTask(e.target.dataset.id);
    //     }

    //     if (e.target.classList.contains("delete")) {
    //         deleteTask(e.target.dataset.id);
    //     }

    // });
    tableBody.addEventListener("click", async function (e) {

    const id = e.target.dataset.id;

    // COMPLETE TASK
    if (e.target.classList.contains("complete")) {
        await markTaskComplete(id);
        loadTasks(); // reload from backend
    }

    // DELETE TASK
    if (e.target.classList.contains("delete")) {
        await fetch(`http://localhost:5000/api/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": token
            }
        });

        loadTasks(); // reload after delete
    }
});
    

    /* =========================
        FILTER BUTTONS
    ========================== */
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");
            renderTasks(button.dataset.filter);
        });
    });
    

    


    /* =========================
        EVENTS
    ========================== */
    //addBtn.addEventListener("click", addTask);
    //if (e.key === "Enter") addTask();

//     taskInput.addEventListener("keypress", function (e) {
//         if (e.key === "Enter") addTask();
//     });

// });
addBtn.addEventListener("click", async function () {
    const text = taskInput.value.trim();
    if (!text) return;

    await addTaskToBackend(text);

    taskInput.value = "";
    loadTasks();
});

taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addBtn.click();
    }
});
const langToggle = document.getElementById("langToggle");

  langToggle.addEventListener("click", function () {
    currentLang = currentLang === "en" ? "jp" : "en";
    updateLanguage();
  });
  loadTasks();
});
//let tasks = [];

const translations = {
  en: {
    title: "Japanese Task Management Portal",
    placeholder: "Write your task...",
    addBtn: "Add Task",
    total: "Total",
    completed: "Completed",
    remaining: "Remaining"
  },
  jp: {
    title: "日本タスク管理ポータル",
    placeholder: "タスクを入力してください...",
    addBtn: "追加",
    total: "合計",
    completed: "完了",
    remaining: "残り"
  }
};

let currentLang = "en";


  


function updateLanguage() {
  const t = translations[currentLang];

  document.getElementById("title").innerText = t.title;
  document.getElementById("taskInput").placeholder = t.placeholder;
  document.getElementById("addBtn").innerText = t.addBtn;
  document.getElementById("totalText").innerText = t.total;
  document.getElementById("completedText").innerText = t.completed;
  document.getElementById("remainingText").innerText = t.remaining;

  // Change button text dynamically
  document.getElementById("langToggle").innerText =
    currentLang === "en" ? "🌏 JP" : "🌏 EN";
}
// async function loadTasks() {
//     const res = await fetch("http://localhost:5000/api/tasks", {
//         headers: {
//             "Authorization": token
//         }
//     });

//     const tasks = await res.json();
//     console.log(tasks); // For now just check
// }

// loadTasks();
