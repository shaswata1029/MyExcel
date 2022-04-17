let rows = 100;
let cols = 26;

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-cont");

for (let i = 1; i <= rows; i++) {
  let addressCol = document.createElement("div");
  addressCol.classList.add("address-col");
  addressCol.innerText = i;
  addressColCont.appendChild(addressCol);
}

for (let i = 0; i < cols; i++) {
  let addressRow = document.createElement("div");
  addressRow.classList.add("address-row");
  addressRow.innerText = String.fromCharCode(65 + i);
  addressRowCont.appendChild(addressRow);
}

for (let i = 0; i < rows; i++) {
  let rowCont = document.createElement("div");
  rowCont.classList.add("row-cont");
  for (let j = 0; j < cols; j++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("contenteditable", "true");
    //  Attributes for cell and storage identification
    cell.setAttribute("rid", i);
    cell.setAttribute("cid", j);
    cell.setAttribute("spellcheck", "false");
    cell.style.outline = "none";
    rowCont.appendChild(cell);
    cell.addEventListener("click", (e) => addressBarDisplay(i, j));
  }
  cellsCont.appendChild(rowCont);
}

function addressBarDisplay(i, j) {
  let addressBar = document.querySelector(".address-bar");
  let rowId = i + 1;
  let colId = String.fromCharCode(65 + j);
  addressBar.value = `${colId}${rowId}`;
}
