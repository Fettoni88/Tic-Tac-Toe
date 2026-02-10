let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let currentPlayer = "circle";

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function init() {
    render();
}

function restartGame() {
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    render();
}

function render() {
    let html = "<table>";

    for (let row = 0; row < 3; row++) {
        html += "<tr>";

        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            let symbol = "";

            if (fields[index] === "circle") {
                symbol = createCircleSVG();
            } else if (fields[index] === "cross") {
                symbol = createCrossSVG();
            }

            const onclick =
                fields[index] === null
                    ? `onclick="handleClick(this, ${index})"`
                    : "";

            html += `<td ${onclick}>${symbol}</td>`;
        }

        html += "</tr>";
    }

    html += "</table>";

    document.getElementById("content").innerHTML = html;
}

function handleClick(td, index) {
    if (fields[index] !== null) {
        return;
    }

    fields[index] = currentPlayer;

    if (currentPlayer === "circle") {
        td.innerHTML = createCircleSVG();
        currentPlayer = "cross";
    } else {
        td.innerHTML = createCrossSVG();
        currentPlayer = "circle";
    }

    td.onclick = null;

    checkGameOver();
}

function checkGameOver() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;

        if (
            fields[a] !== null &&
            fields[a] === fields[b] &&
            fields[a] === fields[c]
        ) {
            drawWinningLine(combo);
            disableAllClicks();
            return true;
        }
    }
    return false;
}

function disableAllClicks() {
    document.querySelectorAll("td").forEach(td => {
        td.onclick = null;
    });
}

function drawWinningLine(combo) {
    const cellSize = 80;
    const lineSize = 5;

    const step = cellSize + lineSize;
    const center = cellSize / 2;

    function getCenter(index) {
        const row = Math.floor(index / 3);
        const col = index % 3;

        return {
            x: col * step + center,
            y: row * step + center
        };
    }

    const start = getCenter(combo[0]);
    const end = getCenter(combo[2]);

    const svg = `
<svg
    width="250"
    height="250"
    style="position:absolute; top:0; left:0; pointer-events:none;">
  <line
    x1="${start.x}" y1="${start.y}"
    x2="${end.x}"   y2="${end.y}"
    stroke="white"
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="400"
    stroke-dashoffset="400">
    <animate
      attributeName="stroke-dashoffset"
      from="400"
      to="0"
      dur="0.2s"
      fill="freeze" />
  </line>
</svg>
`;

    document.getElementById("content").insertAdjacentHTML("beforeend", svg);
}

function createCircleSVG() {
    return `
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" aria-label="circle">
  <circle
    cx="35" cy="35" r="26"
    fill="none"
    stroke="#00B0EF"
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="163.36"
    stroke-dashoffset="163.36">
    <animate
      attributeName="stroke-dashoffset"
      from="163.36"
      to="0"
      dur="0.2s"
      fill="freeze" />
  </circle>
</svg>
`.trim();
}

function createCrossSVG() {
    return `
<svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" aria-label="cross">
  <line
    x1="15" y1="15" x2="55" y2="55"
    stroke="#FFC000"
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="56.57"
    stroke-dashoffset="56.57">
    <animate
      attributeName="stroke-dashoffset"
      from="56.57"
      to="0"
      dur="0.1s"
      fill="freeze" />
  </line>

  <line
    x1="55" y1="15" x2="15" y2="55"
    stroke="#FFC000"
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="56.57"
    stroke-dashoffset="56.57">
    <animate
      attributeName="stroke-dashoffset"
      from="56.57"
      to="0"
      dur="0.1s"
      begin="0.1s"
      fill="freeze" />
  </line>
</svg>
`.trim();
}