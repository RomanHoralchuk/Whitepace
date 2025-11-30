document.addEventListener("DOMContentLoaded", () => {
    fetch("assets/data/data.json")
        .then(r => r.json())
        .then(data => {

            // Remove skeletons
            document.getElementById("skeletonMetrics")?.remove();
            document.getElementById("skeletonTasks")?.remove();

            // Render real content
            renderMetrics(data.metrics);
            renderTasks(data.tasks);
        });

});

function renderMetrics(metrics) {
    const box = document.getElementById("metricCards");

    metrics.forEach(m => {
        const div = document.createElement("div");
        div.className = "metric-card";
        div.innerHTML = `
            <h3>${m.title}</h3>
            <p>${m.value}</p>
        `;
        box.appendChild(div);
    });
}

function renderTasks(tasks) {
    const list = document.getElementById("taskList");

    tasks.forEach(t => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <div class="title">${t.title}</div>
                <div class="badge ${statusClass(t.status)}">${t.status}</div>
            </div>
            <div>${t.dueDate}</div>
        `;

        list.appendChild(li);
    });
}

function statusClass(s) {
    if (s === "Pending") return "pending";
    if (s === "In Progress") return "progress";
    if (s === "Completed") return "done";
}

window.addEventListener("load", () => {
    document.getElementById("page").classList.add("page-loaded");
});

window.addEventListener("scroll", () => {
    const topbar = document.querySelector(".topbar");
    const scrollY = window.scrollY;

    topbar.style.backdropFilter = `blur(${Math.min(20, scrollY / 20)}px)`;
});

window.addEventListener("load", () => {

    // Прячем loading screen
    setTimeout(() => {
        document.getElementById("loadingScreen").classList.add("hide");
    }, 600);

    // Sidebar fly-in
    gsap.from(".sidebar", {
        x: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3
    });

    // Topbar fade
    gsap.from(".topbar", {
        y: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.5
    });

    // Metrics stagger
    gsap.from(".metric-card", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.7,
        ease: "power2.out"
    });

    // Tasks stagger
    gsap.from(".task-list li", {
        y: 20,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        delay: 1.0,
        ease: "power2.out"
    });

});

