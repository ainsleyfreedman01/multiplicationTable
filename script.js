var hoverAnimationEnabled = false;
var button = document.getElementById("myButton");

function changeCellColor(cell) {
    const progressRed = document.getElementById('progressRed');
    const progressYellow = document.getElementById('progressYellow');
    const progressGreen = document.getElementById('progressGreen');

    if (!progressRed.style.width) {
        progressRed.style.width = '0px';
    }
    if (!progressYellow.style.width) {
        progressYellow.style.width = '0px';
    }
    if (!progressGreen.style.width) {
        progressGreen.style.width = '0px';
    }

    if (!hoverAnimationEnabled) {
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
        progressRed.style.marginLeft = parseFloat(progressYellow.style.width) + parseFloat(progressGreen.style.width) + 'px';
        progressYellow.style.marginLeft = parseFloat(progressGreen.style.width) + 'px';

        const percent = document.getElementById('percentage');
        const percentText = parseFloat(parseFloat(progressRed.style.width)/3.0 + (parseFloat(progressYellow.style.width))/1.5 + (parseFloat(progressGreen.style.width)))/4.0;
        percent.textContent = percentText.toFixed(2) + '%';

        const finished = document.getElementById('finished');
        if(progressGreen.style.width === '400px') {
            finished.textContent = 'You did it!';
            finished.style.color = 'green';
            finished.style.left = '474px';
        } else {
            finished.textContent = 'Keep Going!';
            finished.style.color = 'purple';
            finished.style.left = '465px';
        }
    }

    saveColors(); //TODO: write this method!
}

function saveColors() {
    const tableCells = document.querySelectorAll("td");
    const cellColors = Array.from(tableCells).map(cell=>cell.style.backgroundColor);
    const percent = document.getElementById('percentage');
    localStorage.setItem('percent', JSON.stringify(percent.textContent));
    localStorage.setItem('cellColors', JSON.stringify(cellColors));

    const progressRedWidth = parseFloat(document.getElementById('progressRed').style.width);
    const progressYellowWidth = parseFloat(document.getElementById('progressYellow').style.width);
    const progressGreenWidth = parseFloat(document.getElementById('progressGreen').style.width);

    const progressRedLeft = parseFloat(document.getElementById('progressRed').style.marginLeft);
    const progressYellowLeft = parseFloat(document.getElementById('progressYellow').style.marginLeft);
    
    // Save the cell colors and progress bar widths
    const dataToSave = {
        cellColors: cellColors,
        progressRedWidth: progressRedWidth,
        progressYellowWidth: progressYellowWidth,
        progressGreenWidth: progressGreenWidth,
        progressRedLeft: progressRedLeft,
        progressYellowLeft: progressYellowLeft
    };

    localStorage.setItem('savedData', JSON.stringify(dataToSave));
}


function loadColors() {
    const cellColors = JSON.parse(localStorage.getItem('cellColors'));
    const percent = JSON.parse(localStorage.getItem('percent'));
    const savedData = JSON.parse(localStorage.getItem('savedData'))
    document.getElementById('percentage').textContent = percent;
    if (cellColors) {
        const tableCells = document.querySelectorAll("td");
        tableCells.forEach((cell, index) => {
            cell.style.backgroundColor = cellColors[index];
        });
    }
    if(savedData) {
        const savedData = JSON.parse(localStorage.getItem('savedData'));
        document.getElementById('progressRed').style.width = parseFloat(savedData.progressRedWidth) + 'px';
        document.getElementById('progressYellow').style.width = parseFloat(savedData.progressYellowWidth) + 'px';
        document.getElementById('progressGreen').style.width = parseFloat(savedData.progressGreenWidth) + 'px';

        document.getElementById('progressRed').style.marginLeft = parseFloat(savedData.progressRedLeft) + 'px';
        document.getElementById('progressYellow').style.marginLeft = parseFloat(savedData.progressYellowLeft) + 'px';
    }
}

window.onload = loadColors;

function toggleHoverAnimation() {
    hoverAnimationEnabled = !hoverAnimationEnabled;
    if (hoverAnimationEnabled) {
        button.textContent = "Change Color: Off";
        // Add 'hoverable' class to enable hover animation
        document.querySelectorAll("td").forEach(function (td) {
            td.classList.add("hoverable");
        });
    } else {
        button.textContent = "Change Color: On";
        // Remove 'hoverable' class to disable hover animation
        document.querySelectorAll("td").forEach(function (td) {
            td.classList.remove("hoverable");
        });
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
    
    saveColors();
}