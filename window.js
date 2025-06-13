function initializeWindow(win) {
    // Add a title bar with buttons
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.innerHTML = `
        <div class="title"><span>@vyxynn</span>'s profile</div>
        
        <div id="barButtons">
            <button><img src="./assets/minimizeIcon.png" alt="Minimize" width="10px" height="10px"></button>
            <button><img src="./assets/maximizeIcon.png" alt="Maximize" width="10px" height="10px"></button>
            <button><img src="./assets/closeIcon.png" alt="Close" width="10px" height="10px"></button>
        </div>
    `;
    win.appendChild(bar);
}

// Apply functionality to all windows with class 'window'
document.querySelectorAll(".window").forEach(initializeWindow);

