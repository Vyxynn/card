function minimizeWindow(win) {
    win.style.display = "none";
}

function toggleFullscreen(win) {
    if (win.dataset.fullscreen === "true") {
        win.style.left = win.dataset.prevLeft;
        win.style.top = win.dataset.prevTop;
        win.style.width = win.dataset.prevWidth;
        win.style.height = win.dataset.prevHeight;
        win.dataset.fullscreen = "false";
    } else {
        win.dataset.prevLeft = win.style.left;
        win.dataset.prevTop = win.style.top;
        win.dataset.prevWidth = win.style.width;
        win.dataset.prevHeight = win.style.height;
        win.style.left = "0px";
        win.style.top = "0px";
        win.style.width = "100vw";
        win.style.height = "100vh";
        win.dataset.fullscreen = "true";
    }
}

function closeWindow(win) {
    win.remove();
}

// Function that adds the inner elements and functionality
function initializeWindow(win) {
    // Add a title bar with buttons
    const bar = document.createElement("div");
    bar.classList.add("bar");

    bar.innerHTML = `
        <div class="title"><span>@vyxynn</span>'s profile</div>
        
        <div id="barButtons">
            <button onclick="minimizeWindow(this.parentElement.parentElement.parentElement)"><img src="./assets/minimizeIcon.png" alt="Minimize" width="10px" height="10px"></button>
            <button onclick="toggleFullscreen(this.parentElement.parentElement.parentElement)"><img src="./assets/maximizeIcon.png" alt="Maximize" width="10px" height="10px"></button>
            <button onclick="closeWindow(this.parentElement.parentElement.parentElement)" style="margin-right: 2px;"><img src="./assets/closeIcon.png" alt="Close" width="10px" height="10px"></button>
        </div>
        
    `;
    win.appendChild(bar);

    // Add resizers
    const directions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'left', 'right', 'bottom'];
    directions.forEach(direction => {
        const resizer = document.createElement("div");
        resizer.classList.add("resizer", `resizer-${direction}`);
        win.appendChild(resizer);
    });

    makeWindowDraggableAndResizable(win);
}

// Function to make windows draggable and resizable
function makeWindowDraggableAndResizable(win) {
    let bar = win.querySelector(".bar");
    let resizers = win.querySelectorAll(".resizer");
    let isResizing = false, isMoving = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;
    let direction = '';

    // When a window is clicked, bring it to the front (higher z-index)
    win.addEventListener("mousedown", () => {
        bringToFront(win);
    });

    // Make the window draggable
    bar.addEventListener("mousedown", (e) => {
        isMoving = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = win.offsetLeft;
        startTop = win.offsetTop;
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stopAction);
    });

    // Make the window resizable
    resizers.forEach(resizer => {
        resizer.addEventListener("mousedown", (e) => {
            isResizing = true;
            direction = e.target.classList[1]; // Get direction based on class
            startX = e.clientX;
            startY = e.clientY;
            startWidth = win.offsetWidth;
            startHeight = win.offsetHeight;
            startLeft = win.offsetLeft;
            startTop = win.offsetTop;
            document.addEventListener("mousemove", (event) => resize(event, direction, win));
            document.addEventListener("mouseup", stopAction);
        });
    });

    function move(e) {
        if (isMoving) {
            win.style.left = (startLeft + e.clientX - startX) + "px";
            win.style.top = (startTop + e.clientY - startY) + "px";
        }
    }

    function resize(e, direction, win) {
        if (isResizing) {
            if (direction.includes("right")) {
                let newWidth = startWidth + (e.clientX - startX);
                win.style.width = newWidth + "px";
            }
            if (direction.includes("bottom")) {
                let newHeight = startHeight + (e.clientY - startY);
                win.style.height = newHeight + "px";
            }
            if (direction.includes("left")) {
                let newWidth = startWidth - (e.clientX - startX);
                let newLeft = startLeft + (e.clientX - startX);
                win.style.width = newWidth + "px";
                win.style.left = newLeft + "px";
            }
            if (direction.includes("top")) {
                let newHeight = startHeight - (e.clientY - startY);
                let newTop = startTop + (e.clientY - startY);
                win.style.height = newHeight + "px";
                win.style.top = newTop + "px";
            }
        }
    }

    function stopAction() {
        isMoving = false;
        isResizing = false;
        direction = '';
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopAction);
    }
}

// Function to bring a window to the front by setting a higher z-index
function bringToFront(win) {
    let allWindows = document.querySelectorAll(".window");
    let maxZIndex = 0;

    // Find the highest z-index among all windows
    allWindows.forEach(window => {
        let zIndex = parseInt(window.style.zIndex) || 1;
        maxZIndex = Math.max(maxZIndex, zIndex);
    });

    // Set the clicked window's z-index to be higher
    win.style.zIndex = maxZIndex + 1;
}

// Apply functionality to all windows with class 'window'
document.querySelectorAll(".window").forEach(initializeWindow);
