// Storage

let sheetDB = [];
// contains current sheet information/properties

{
  let addSheetBtn = document.querySelector(".sheet-add-icon");
  addSheetBtn.click();
}

// for (let i = 0; i < rows; i++) {
//   let sheetRow = [];
//   for (let j = 0; j < cols; j++) {
//     let cellProp = {
//       bold: false,
//       italic: false,
//       underline: false,
//       alignment: "left",
//       fontFamily: "monospace",
//       fontSize: 14,
//       fontColor: "#000000",
//       BGcolor: "#ecf0f1", //Just for indication purpose default value
//       value: "",
//       formula: "",
//       children: [],
//     };
//     sheetRow.push(cellProp);
//   }
//   sheetDB.push(sheetRow);
// }

let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";

// Selectors for cell properties
let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];
let formulaBar = document.querySelector(".formula-bar");

// Aplliction of 2-way binding
// Attach property listeners for every properties

function decodeAddress(address) {
  // address-->"A1".example address
  let rid = Number(address.slice(1)) - 1;
  let cid = Number(address.charCodeAt(0)) - 65;
  return [rid, cid];
}

function getActiveCell(address) {
  let [rid, cid] = decodeAddress(address);
  //   console.log(rid);
  //   console.log(cid);
  //   Access cell and storages for
  let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
  //   console.log(cell);
  let cellProp = sheetDB[rid][cid];
  //   console.log(cellProp);
  return [cell, cellProp];
}

bold.addEventListener("click", (e) => {
  let address = document.querySelector(".address-bar").value;
  let [cell, cellProp] = getActiveCell(address);

  //   Modifiaction
  cellProp.bold = !cellProp.bold;
  cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
  bold.style.background = cellProp.bold ? activeColorProp : inactiveColorProp;
});

italic.addEventListener("click", (e) => {
  let address = document.querySelector(".address-bar").value;
  let [cell, cellProp] = getActiveCell(address);

  //   Modifiaction
  cellProp.italic = !cellProp.italic;
  cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
  italic.style.background = cellProp.italic
    ? activeColorProp
    : inactiveColorProp;
});

underline.addEventListener("click", (e) => {
  let address = document.querySelector(".address-bar").value;
  let [cell, cellProp] = getActiveCell(address);

  //   Modifiaction
  cellProp.underline = !cellProp.underline;
  cell.style.textDecoration = cellProp.underline ? "underline" : "none";
  underline.style.background = cellProp.underline
    ? activeColorProp
    : inactiveColorProp;
});

fontSize.addEventListener("change", (e) => {
  let address = document.querySelector(".address-bar").value;
  let [cell, cellProp] = getActiveCell(address);

  //   Modifiaction
  cellProp.fontSize = fontSize.value;
  cell.style.fontSize = `${cellProp.fontSize}px`;
  fontSize.value = cellProp.fontSize;
});

fontFamily.addEventListener("change", (e) => {
  let address = document.querySelector(".address-bar").value;
  let [cell, cellProp] = getActiveCell(address);

  //   Modifiaction
  cellProp.fontFamily = fontFamily.value;
  cell.style.fontFamily = cellProp.fontFamily;
  fontFamily.value = cellProp.fontFamily;
});

fontColor.addEventListener("change", (e) => {
  let address = document.querySelector(".address-bar").value;
  let [cell, cellProp] = getActiveCell(address);

  //   Modifiaction
  cellProp.fontColor = fontColor.value;
  cell.style.color = cellProp.fontColor;
  fontColor.value = cellProp.fontColor;
});

BGcolor.addEventListener("change", (e) => {
  let address = document.querySelector(".address-bar").value;
  let [cell, cellProp] = getActiveCell(address);

  //   Modifiaction
  cellProp.BGcolor = BGcolor.value;
  cell.style.backgroundColor = cellProp.BGcolor;
  BGcolor.value = cellProp.BGcolor;
});

alignment.forEach((alignElem) => {
  alignElem.addEventListener("click", (e) => {
    let address = document.querySelector(".address-bar").value;
    let [cell, cellProp] = getActiveCell(address);

    let alignValue = e.target.classList[0];
    cellProp.alignment = alignValue;
    cell.style.textAlign = cellProp.alignment;

    switch (alignValue) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
  });
});

let allCells = document.querySelectorAll(".cell");
for (let i = 0; i < allCells.length; i++) {
  addListenerToAttachCellProperties(allCells[i]);
}
function addListenerToAttachCellProperties(cell) {
  cell.addEventListener("click", (e) => {
    let address = document.querySelector(".address-bar").value;
    let [rid, cid] = decodeAddress(address);
    let cellProp = sheetDB[rid][cid];

    //   Apply cell properties to individual cells
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    cell.style.fontSize = `${cellProp.fontSize}px`;
    cell.style.fontFamily = cellProp.fontFamily;
    cell.style.color = cellProp.fontColor;
    cell.style.backgroundColor = cellProp.BGcolor;
    cell.style.textAlign = cellProp.alignment;
    cell.innerText = cellProp.value;

    // Apply properties to UI container
    bold.style.background = cellProp.bold ? activeColorProp : inactiveColorProp;
    italic.style.background = cellProp.italic
      ? activeColorProp
      : inactiveColorProp;
    underline.style.background = cellProp.underline
      ? activeColorProp
      : inactiveColorProp;
    fontSize.value = cellProp.fontSize;
    fontFamily.value = cellProp.fontFamily;
    fontColor.value = cellProp.fontColor;
    BGcolor.value = cellProp.BGcolor;
    switch (cellProp.alignment) {
      case "left":
        leftAlign.style.backgroundColor = activeColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "center":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = activeColorProp;
        rightAlign.style.backgroundColor = inactiveColorProp;
        break;
      case "right":
        leftAlign.style.backgroundColor = inactiveColorProp;
        centerAlign.style.backgroundColor = inactiveColorProp;
        rightAlign.style.backgroundColor = activeColorProp;
        break;
    }
    formulaBar.value = cellProp.formula;
  });
}
