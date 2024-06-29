var flipAnimationEnabled = false;
var button = document.getElementById("myButton");
var tiles = document.querySelectorAll('td'); // Changed to tiles for NodeList

// Iterate over each td element to add event listeners
tiles.forEach(tile => {
    tile.addEventListener('click', function() {
        decideClickBehavior(this); // Pass the clicked element as parameter
    });
});

function changeCellColor(cell) {
    const progressRed = document.getElementById('progressRed');
    const progressYellow = document.getElementById('progressYellow');
    const progressGreen = document.getElementById('progressGreen');

    // Initialize progress bars if not already set
    if (!progressRed.style.width) {
        progressRed.style.width = '0px';
    }
    if (!progressYellow.style.width) {
        progressYellow.style.width = '0px';
    }
    if (!progressGreen.style.width) {
        progressGreen.style.width = '0px';
    }

    if (!flipAnimationEnabled) {
        var currentColor = getComputedStyle(cell).backgroundColor;
        switch (currentColor) {
            case "rgb(255, 255, 255)": // White in RGB format
                cell.style.backgroundColor = "red";
                progressRed.style.width = parseFloat(progressRed.style.width) + 4 + 'px';
                break;
            case "rgb(255, 0, 0)": // Red in RGB format
                cell.style.backgroundColor = "#FFC300";
                progressRed.style.width = parseFloat(progressRed.style.width) - 4 + 'px';
                progressYellow.style.width = parseFloat(progressYellow.style.width) + 4 + 'px';
                break;
            case "rgb(255, 195, 0)": // #FFC300 in RGB format
                cell.style.backgroundColor = "green";
                progressYellow.style.width = parseFloat(progressYellow.style.width) - 4 + 'px';
                progressGreen.style.width = parseFloat(progressGreen.style.width) + 4 + 'px';
                break;
            case "rgb(0, 128, 0)": // Green in RGB format
                cell.style.backgroundColor = "white";
                progressGreen.style.width = parseFloat(progressGreen.style.width) - 4 + 'px';
                break;
            default:
                cell.style.backgroundColor = "white";
                break;
        }

        // Adjust progress bar margins based on widths
        progressRed.style.marginLeft = parseFloat(progressYellow.style.width) + parseFloat(progressGreen.style.width) + 'px';
        progressYellow.style.marginLeft = parseFloat(progressGreen.style.width) + 'px';

        // Calculate and update percentage
        const percent = document.getElementById('percentage');
        const percentText = parseFloat(parseFloat(progressRed.style.width) / 3.0 + (parseFloat(progressYellow.style.width)) / 1.5 + (parseFloat(progressGreen.style.width))) / 4.0;
        percent.textContent = percentText.toFixed(2) + '%';

        // Update 'finished' message based on progress
        const finished = document.getElementById('finished');
        if (progressGreen.style.width === '400px') {
            finished.textContent = 'You did it!';
            finished.style.color = 'green';
        } else {
            finished.textContent = 'Keep Going!';
            finished.style.color = 'purple';
        }
    }

    saveColors(); // Save current state to local storage
}

function decideClickBehavior(cell) {
    if (!flipAnimationEnabled) {
        changeCellColor(cell);
    } else {
        if (cell.classList.contains('flipped')) {
            // Flip back
            cell.style.transition = 'transform 0.7s';
            cell.style.transform = 'none';
            cell.classList.remove('flipped');
        } else {
            // Flip
            flipAnimation(cell);
        }
    }
}

function flipAnimation(cell) {
    cell.style.transition = 'transform 0.7s';
    cell.style.transform = 'rotateY(180deg)';
    cell.classList.add('flipped');
    cell.style.cursor = 'default';
}

function toggleFlipAnimation() {
    flipAnimationEnabled = !flipAnimationEnabled;
    if (flipAnimationEnabled) {
        button.textContent = "Change Color: Off";
        // Add 'hoverable' class to enable hover animation
    } else {
        button.textContent = "Change Color: On";
        // Remove 'hoverable' class to disable hover animation
    }
}

function clearAll() {
    const tableCells = document.querySelectorAll("td");
    tableCells.forEach((cell) => {
        cell.style.backgroundColor = "white";
    });

    const percent = document.getElementById('percentage');
    percent.textContent = '0.00%';

    const progressRed = document.getElementById('progressRed');
    const progressYellow = document.getElementById('progressYellow');
    const progressGreen = document.getElementById('progressGreen');

    progressRed.style.width = '0px';
    progressYellow.style.width = '0px';
    progressGreen.style.width = '0px';

    const finished = document.getElementById('finished');
    finished.textContent = '';
    
    saveColors(); // Save cleared state to local storage
}

function saveColors() {
    const tableCells = document.querySelectorAll("td");
    const cellColors = Array.from(tableCells).map(cell => cell.style.backgroundColor);
    const percent = document.getElementById('percentage').textContent;

    const progressRedWidth = parseFloat(document.getElementById('progressRed').style.width);
    const progressYellowWidth = parseFloat(document.getElementById('progressYellow').style.width);
    const progressGreenWidth = parseFloat(document.getElementById('progressGreen').style.width);

    const progressRedLeft = parseFloat(document.getElementById('progressRed').style.marginLeft);
    const progressYellowLeft = parseFloat(document.getElementById('progressYellow').style.marginLeft);
    
    // Save the cell colors and progress bar widths
    const dataToSave = {
        cellColors: cellColors,
        percent: percent,
        progressRedWidth: progressRedWidth,
        progressYellowWidth: progressYellowWidth,
        progressGreenWidth: progressGreenWidth,
        progressRedLeft: progressRedLeft,
        progressYellowLeft: progressYellowLeft
    };

    localStorage.setItem('savedData', JSON.stringify(dataToSave));
}

function loadColors() {
    const savedData = JSON.parse(localStorage.getItem('savedData'));
    if (savedData) {
        const cellColors = savedData.cellColors;
        const percent = savedData.percent;

        document.getElementById('percentage').textContent = percent;

        // Set cell colors from saved data
        const tableCells = document.querySelectorAll("td");
        tableCells.forEach((cell, index) => {
            cell.style.backgroundColor = cellColors[index];
        });

        // Set progress bar widths and margins from saved data
        document.getElementById('progressRed').style.width = savedData.progressRedWidth + 'px';
        document.getElementById('progressYellow').style.width = savedData.progressYellowWidth + 'px';
        document.getElementById('progressGreen').style.width = savedData.progressGreenWidth + 'px';

        document.getElementById('progressRed').style.marginLeft = savedData.progressRedLeft + 'px';
        document.getElementById('progressYellow').style.marginLeft = savedData.progressYellowLeft + 'px';
    }
}

window.onload = loadColors; // Load saved colors on page load