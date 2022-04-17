// Storage --->2D Matrix

let graphComponentsMatrix = [];

// for (let i = 0; i < rows; i++) {
//   let row = [];
//   for (let j = 0; j < cols; j++) {
//     //   More than one child relation/dependency
//     row.push([]);
//   }
//   graphComponentsMatrix.push(row);
// }

// true-->Cyclic, false-->notCyclic
function isGraphCyclic() {
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

  let isCyclic = false;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      isCyclic = isCyclic || dfsCycleDetection(i, j, visited, dfsVisited);
      if (isCyclic === true) {
        return [i, j];
      }
    }
  }

  return null;
}

// True or false
function dfsCycleDetection(srcr, srcc, visited, dfsVisited) {
  visited[srcr][srcc] = true;
  dfsVisited[srcr][srcc] = true;

  let ans = false;
  let dependencies = graphComponentsMatrix[srcr][srcc];

  for (let i = 0; i < dependencies.length; i++) {
    //   destination row,destination column
    let [destr, destc] = dependencies[i];
    if (dfsVisited[destr][destc] == true) ans = ans || true;
    else if (visited[destr][destc] == false)
      ans = ans || dfsCycleDetection(destr, destc, visited, dfsVisited);
  }

  dfsVisited[srcr][srcc] = false;
  return ans;
  //   Return whether cycle is found or not
}
