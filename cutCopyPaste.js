let ctrlKey;
document.addEventListener("keydown", (e) => {
  ctrlKey = e.ctrlKey;
});

document.addEventListener("keyup", (e) => {
  ctrlKey = e.ctrlKey;
});

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    handleSelectedCells(cell);
  }
}

let rangeStorage = [];
let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

function handleSelectedCells(cell) {
  cell.addEventListener("click", (e) => {
    //   Select cells range work
    if (!ctrlKey) return;

    if (rangeStorage.length >= 2) {
      let prevCell = document.querySelector(
        `.cell[rid="${rangeStorage[0][0]}"][cid="${rangeStorage[0][1]}"]`
      );
      prevCell.style.border = "1px solid #dfe4ea";
      rangeStorage.splice(0, 1);
    }

    // Set the UI
    cell.style.border = "3px solid #218c74";

    let rid = Number(cell.getAttribute("rid"));
    let cid = Number(cell.getAttribute("cid"));
    rangeStorage.push([rid, cid]);
    console.log(rangeStorage);
  });
}

function defaultSelectedCellUI() {
  for (let i = 0; i < rangeStorage.length; i++) {
    let cell = document.querySelector(
      `.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`
    );
    cell.style.border = "1px solid #dfe4ea";
  }
  rangeStorage = [];
  console.log(rangeStorage);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    defaultSelectedCellUI();
  }
});

let copyData = [];

// Functionality for copy operation
copyBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) {
    alert("You must select two cells for copying the data");
    return;
  }

  copyData = [];

  let startRow = Math.min(
    Number(rangeStorage[0][0]),
    Number(rangeStorage[1][0])
  );
  let endRow = Math.max(Number(rangeStorage[0][0]), Number(rangeStorage[1][0]));
  let startCol = Math.min(
    Number(rangeStorage[0][1]),
    Number(rangeStorage[1][1])
  );
  let endCol = Math.max(Number(rangeStorage[0][1]), Number(rangeStorage[1][1]));

  for (let i = startRow; i <= endRow; i++) {
    let copyRow = [];
    for (let j = startCol; j <= endCol; j++) {
      let cellProp = Object.assign({}, sheetDB[i][j]);
      copyRow.push(cellProp);
    }
    copyData.push(copyRow);
  }

  console.log(copyData);
  defaultSelectedCellUI();
});

// Functionality for cut operation
cutBtn.addEventListener("click", (e) => {
  if (rangeStorage.length < 2) {
    alert("You must select two cells for copying the data");
    return;
  }

  copyData = [];

  let startRow = Math.min(
    Number(rangeStorage[0][0]),
    Number(rangeStorage[1][0])
  );
  let endRow = Math.max(Number(rangeStorage[0][0]), Number(rangeStorage[1][0]));
  let startCol = Math.min(
    Number(rangeStorage[0][1]),
    Number(rangeStorage[1][1])
  );
  let endCol = Math.max(Number(rangeStorage[0][1]), Number(rangeStorage[1][1]));

  for (let i = startRow; i <= endRow; i++) {
    let copyRow = [];
    for (let j = startCol; j <= endCol; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      // const cloneFood = Object.assign({}, food);
      let cellProp = sheetDB[i][j];
      let cutCellProp = Object.assign({}, sheetDB[i][j]);
      copyRow.push(cutCellProp);

      // set default values to DB
      cellProp.value = "";
      cellProp.bold = false;
      cellProp.italic = false;
      cellProp.underline = false;
      cellProp.fontSize = 14;
      cellProp.fontFamily = "monospace";
      cellProp.fontColor = "#000000";
      cellProp.BGcolor = "#ecf0f1";
      cellProp.alignment = "left";

      // UI change
      cell.click();
    }
    copyData.push(copyRow);
  }

  console.log(copyData);
  defaultSelectedCellUI();
});

// Functionality for paste operation
pasteBtn.addEventListener("click", (e) => {
  // Past cells data work

  if (copyData.length == 0) {
    alert("Please copy the data first");
    return;
  }

  let address = document.querySelector(".address-bar").value;
  let [rid, cid] = decodeAddress(address);
  let startRow = rid;
  let startCol = cid;
  let rowDiff = copyData.length - 1;
  let colDiff = copyData[0].length - 1;
  let endRow = startRow + rowDiff;
  let endCol = startCol + colDiff;

  //   r-->refers copyData row
  //  c--->refers copyData column
  for (let i = startRow, r = 0; i <= endRow; i++, r++) {
    for (let j = startCol, c = 0; j <= endCol; j++, c++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      if (!cell) continue;

      let data = copyData[r][c];
      let cellProp = sheetDB[i][j];

      //   DB Change
      cellProp.value = data.value;
      cellProp.bold = data.bold;
      cellProp.italic = data.italic;
      cellProp.underline = data.underline;
      cellProp.fontSize = data.fontSize;
      cellProp.fontFamily = data.fontFamily;
      cellProp.fontColor = data.fontColor;
      cellProp.BGcolor = data.BGcolor;
      cellProp.alignment = data.alignment;

      //   UI change
      cell.click();
    }
  }
});
