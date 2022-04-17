// true-->Cyclic, false-->notCyclic

// For delay and wait for 1s for showing color
function colorPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

async function isGraphCyclicTracePath(cycleResponse) {
  // Dependency -->visited,dfsVisited(2D Array)

  let visited = [];
  let dfsVisited = [];

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      //   Initially all were unvisited
      row.push(false);
    }
    visited.push(row);
    dfsVisited.push(row);
  }

  let [srcr, srcc] = cycleResponse;

  //   let isCyclic = false;
  //   for (let i = 0; i < rows; i++) {
  //     for (let j = 0; j < cols; j++) {
  //       isCyclic = isCyclic || dfsCycleDetection(i, j, visited, dfsVisited);
  //     }
  //   }

  let response = await dfsCycleDetectionTracePath(
    srcr,
    srcc,
    visited,
    dfsVisited
  );
  if (response === true) return Promise.resolve(true);

  return Promise.resolve(false);
}

// Coloring cells for tracking
async function dfsCycleDetectionTracePath(srcr, srcc, visited, dfsVisited) {
  console.log(`entering ${srcr},${srcc}`);
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  let cell = document.querySelector(`.cell[rid="${srcr}"][cid="${srcc}"]`);
  let cellProp = sheetDB[srcr][srcc];

  cell.style.backgroundColor = "lightblue";
  await colorPromise();
  //   Wait for 1s

  let dependencies = graphComponentsMatrix[srcr][srcc];

  for (let i = 0; i < dependencies.length; i++) {
    //   destination row,destination column
    let [destr, destc] = dependencies[i];
    if (visited[destr][destc] == false) {
      let ans = await dfsCycleDetectionTracePath(
        destr,
        destc,
        visited,
        dfsVisited
      );
      if (ans == true) {
        cell.style.backgroundColor = cellProp.BGcolor;
        await colorPromise();
        console.log(`leaving ${srcr},${srcc}`);
        return Promise.resolve(true);
      }
    } else if (dfsVisited[destr][destc] == true) {
      let cyclicCell = document.querySelector(
        `.cell[rid="${destr}"][cid="${destc}"]`
      );

      cyclicCell.style.backgroundColor = "lightsalmon";
      await colorPromise();

      cyclicCell.style.backgroundColor = "lightblue";
      await colorPromise();

      cell.style.backgroundColor = cellProp.BGcolor;
      await colorPromise();

      console.log(`leaving ${srcr},${srcc}`);
      return Promise.resolve(true);
    }
  }

  dfsVisited[srcr][srcc] = false;
  cell.style.backgroundColor = cellProp.BGcolor;
  await colorPromise();
  console.log(`leaving ${srcr},${srcc}`);
  return Promise.resolve(false);
  //   Return whether cycle is found or not
}
