let downloadBtn = document.querySelector(".download");
let openBtn = document.querySelector(".open");

// Download option
downloadBtn.addEventListener("click", (e) => {
  // Converting to json data
  let jsonData = JSON.stringify([sheetDB, graphComponentsMatrix]);
  // Converting to a new Blob
  let file = new Blob([jsonData], { type: "application/json" });

  let a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = "SheetData.json";
  a.click();
});

// Open(Upload) option

openBtn.addEventListener("click", (e) => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  // Opens file explorer
  input.click();

  input.addEventListener("change", (e) => {
    let fr = new FileReader();
    // Returns a file list object from a file type input
    let files = input.files;
    let fileObject = files[0];
    fr.readAsText(fileObject);
    fr.addEventListener("load", (e) => {
      let readSheetData = JSON.parse(fr.result);
      // New sheet with default data will be created
      addSheetBtn.click();

      sheetDB = readSheetData[0];
      graphComponentsMatrix = readSheetData[1];
      collectedSheetDB[collectedSheetDB.length - 1] = sheetDB;
      collectedGraphComponent[collectedGraphComponent.length - 1] =
        graphComponentsMatrix;
      handleSheetProperties();
    });
  });
});
