let collectedSheetDB = [];
// Contains all sheetDB
let collectedGraphComponent = [];
// contains graph components of all sheets

let activeSheetColor = "#ced6e0";

let sheetsFolderContainer = document.querySelector(".sheets-folder-cont");
let addSheetBtn = document.querySelector(".sheet-add-icon");

addSheetBtn.addEventListener("click", (e) => {
  let sheet = document.createElement("div");
  sheet.classList.add("sheet-folder");

  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  sheet.setAttribute("id", allSheetFolders.length);
  sheet.innerHTML = `
  <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
  `;
  sheetsFolderContainer.appendChild(sheet);

  // DB
  createSheetDB();
  createGraphComponentMatrix();
  handleSheetActiveness(sheet);
  handleSheetRemoval(sheet);
  sheet.click();

  // Current sheet into view
  sheet.scrollIntoView();
});

function createSheetDB() {
  let newSheetDB = [];

  for (let i = 0; i < rows; i++) {
    let sheetRow = [];
    for (let j = 0; j < cols; j++) {
      let cellProp = {
        bold: false,
        italic: false,
        underline: false,
        alignment: "left",
        fontFamily: "monospace",
        fontSize: 14,
        fontColor: "#000000",
        BGcolor: "#ecf0f1", //Just for indication purpose default value
        value: "",
        formula: "",
        children: [],
      };
      sheetRow.push(cellProp);
    }
    newSheetDB.push(sheetRow);
  }

  collectedSheetDB.push(newSheetDB);
}

function createGraphComponentMatrix() {
  let newGraphComponentsMatrix = [];

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      //   More than one child relation/dependency
      row.push([]);
    }
    newGraphComponentsMatrix.push(row);
  }

  collectedGraphComponent.push(newGraphComponentsMatrix);
}

function handleSheetDB(sheetIdx) {
  sheetDB = collectedSheetDB[sheetIdx];
}

function handleGraphComponentsMatrix(sheetIdx) {
  graphComponentsMatrix = collectedGraphComponent[sheetIdx];
}

function handleSheetProperties() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
      cell.click();
    }
  }
  // By default click on first cell in the sheet
  let firstCell = document.querySelector(".cell");
  firstCell.click();
  // Click on first cell via DOM
}

function handleSheetUI(sheet) {
  let allSheetFolders = document.querySelectorAll(".sheet-folder");

  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].style.backgroundColor = "#ecf0f1";
  }

  sheet.style.backgroundColor = activeSheetColor;
}

function handleSheetActiveness(sheet) {
  sheet.addEventListener("click", (e) => {
    let sheetIdx = Number(sheet.getAttribute("id"));
    handleSheetDB(sheetIdx);
    handleGraphComponentsMatrix(sheetIdx);
    handleSheetProperties();
    handleSheetUI(sheet);
  });
}

function handleSheetUIRemoval(sheet) {
  sheet.remove();
  // Remove the sheet node/UI
  let allSheetFolders = document.querySelectorAll(".sheet-folder");
  for (let i = 0; i < allSheetFolders.length; i++) {
    allSheetFolders[i].setAttribute("id", i);
    let sheetContent = allSheetFolders[i].querySelector(".sheet-content");
    sheetContent.innerText = `Sheet ${i + 1}`;
  }
}

function handleSheetRemoval(sheet) {
  sheet.addEventListener("mousedown", (e) => {
    // e.button --->0(left click),1(scroll click),2(right click)
    if (e.button !== 2) return;

    let allSheetFolders = document.querySelectorAll(".sheet-folder");
    if (allSheetFolders.length === 1) {
      alert("You need to have atleast one sheet");
      return;
    }

    let response = confirm(
      "Your sheet will be removed permanently.Are you sure?"
    );

    if (response === false) return;

    let sheetIdx = Number(sheet.getAttribute("id"));
    collectedSheetDB.splice(sheetIdx, 1);
    collectedGraphComponent.splice(sheetIdx, 1);

    handleSheetUIRemoval(sheet);

    // By default assign DB to sheet 1
    let firstSheet = document.querySelector(".sheet-folder");
    firstSheet.click();
  });
}
