for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    cell.addEventListener("blur", (e) => {
      let address = document.querySelector(".address-bar").value;
      let [activeCell, cellProp] = getActiveCell(address);
      let enteredData = activeCell.innerText;
      if (enteredData == cellProp.value) {
        return;
      }
      cellProp.value = enteredData;

      // Remove
      removeChildFromParent(cellProp.formula);
      removeChildFromGraphComponent(cellProp.formula, address);
      cellProp.formula = "";
      // If data is modified update children with new modified value
      updateChildrenCells(address);
      //   console.log(cellProp);
    });
  }
}

formulaBar.addEventListener("keydown", async (e) => {
  let inputFormula = formulaBar.value;
  if (e.key == "Enter" && inputFormula) {
    // to update UI and CellProp in DB
    let address = document.querySelector(".address-bar").value;
    let [cell, cellProp] = getActiveCell(address);
    if (inputFormula == cellProp.formula) return;
    removeChildFromParent(cellProp.formula);
    removeChildFromGraphComponent(cellProp.formula, address);
    // If Change in formula break old relationship and add new relation

    // Add the realtionship for detection of Cycle
    addChildToGraphComponent(inputFormula, address);

    // Check formula is formula is cyclic or not
    // true-->Cyclic, false-->notCyclic
    let cycleResponse = isGraphCyclic();
    console.log(cycleResponse);
    if (cycleResponse) {
      // alert("Your Formula is Cyclic");
      let response = confirm(
        "Your Formula is Cyclic.Do you want to trace your path?"
      );
      while (response === true) {
        // Keep on tracking color until user is satisfied
        await isGraphCyclicTracePath(cycleResponse);
        response = confirm(
          "Your Formula is Cyclic.Do you want to trace your path?"
        );
      }
      removeChildFromGraphComponent(inputFormula, address);
      addChildToGraphComponent(cellProp.formula, address);
      addChildToParent(cellProp.formula);
      setCellUIAndCellProp(cellProp.value, cellProp.formula, address);
      updateChildrenCells(address);
      return;
    }

    let evalautedValue = evaluateFormula(inputFormula);
    setCellUIAndCellProp(evalautedValue, inputFormula, address);
    addChildToParent(inputFormula);
    updateChildrenCells(address);
    console.log(sheetDB);
  }
});

function addChildToParent(formula) {
  let childAddress = document.querySelector(".address-bar").value;
  let [childCell, childCellProp] = getActiveCell(childAddress);
  // console.log(formula);
  // Formula should be space separated
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getActiveCell(encodedFormula[i]);
      parentCellProp.children.push(childAddress);
      console.log(parentCellProp);
      // console.log(childCellProp);
    }
  }
}

function removeChildFromParent(formula) {
  let childAddress = document.querySelector(".address-bar").value;
  let [childCell, childCellProp] = getActiveCell(childAddress);
  // console.log(formula);
  // Formula should be space separated
  let encodedFormula = formula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [parentCell, parentCellProp] = getActiveCell(encodedFormula[i]);
      let idx = parentCellProp.children.indexOf(childAddress);
      parentCellProp.children.splice(idx, 1);
      console.log(parentCellProp);
      // console.log(childCellProp);
    }
  }
}

function updateChildrenCells(parentAddress) {
  let [parentCell, parentCellProp] = getActiveCell(parentAddress);
  let children = parentCellProp.children;

  for (let i = 0; i < children.length; i++) {
    let childAddress = children[i];
    let [childCell, childCellProp] = getActiveCell(childAddress);
    let childFormula = childCellProp.formula;
    let evaluatedValue = evaluateFormula(childFormula);
    setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
    updateChildrenCells(childAddress);
  }
}

function addChildToGraphComponent(inputFormula, childAddress) {
  let [crid, ccid] = decodeAddress(childAddress);
  // console.log(formula);
  // Formula should be space separated
  let encodedFormula = inputFormula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeAddress(encodedFormula[i]);
      graphComponentsMatrix[prid][pcid].push([crid, ccid]);
    }
  }
}

function removeChildFromGraphComponent(inputFormula, childAddress) {
  let child = decodeAddress(childAddress);
  // console.log(formula);
  // Formula should be space separated
  let encodedFormula = inputFormula.split(" ");

  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [prid, pcid] = decodeAddress(encodedFormula[i]);
      let idx = graphComponentsMatrix[prid][pcid].indexOf(child);
      graphComponentsMatrix[prid][pcid].splice(idx, 1);
    }
  }
}

function evaluateFormula(formula) {
  // console.log(formula);
  // Formula should be space separated
  let encodedFormula = formula.split(" ");
  // console.log(encodedFormula);
  for (let i = 0; i < encodedFormula.length; i++) {
    let asciiValue = encodedFormula[i].charCodeAt(0);
    if (asciiValue >= 65 && asciiValue <= 90) {
      let [activeCell, cellProp] = getActiveCell(encodedFormula[i]);
      encodedFormula[i] = cellProp.value;
    }
  }

  let decodedFormula = encodedFormula.join(" ");
  // console.log(decodedFormula);
  return eval(decodedFormula);
}

function setCellUIAndCellProp(evalautedValue, formula, address) {
  // let address = document.querySelector(".address-bar").value;
  let [activeCell, cellProp] = getActiveCell(address);
  activeCell.innerText = evalautedValue;
  // UI Update
  cellProp.value = evalautedValue;
  cellProp.formula = formula;
  // sheetDB update
}
