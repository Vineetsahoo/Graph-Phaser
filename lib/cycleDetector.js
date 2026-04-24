function sortedComponent(componentSet) {
  return Array.from(componentSet).sort();
}

function hasDirectedCycle(componentNodes, adjacency) {
  const inComponent = new Set(componentNodes);
  const state = new Map();

  for (const node of componentNodes) {
    state.set(node, 0);
  }

  const dfs = (node) => {
    state.set(node, 1);

    const children = adjacency.get(node) || new Set();
    for (const child of children) {
      if (!inComponent.has(child)) continue;

      if (state.get(child) === 1) {
        return true;
      }

      if (state.get(child) === 0 && dfs(child)) {
        return true;
      }
    }

    state.set(node, 2);
    return false;
  };

  for (const node of componentNodes) {
    if (state.get(node) === 0 && dfs(node)) {
      return true;
    }
  }

  return false;
}

export function analyzeComponents(nodes, undirected, adjacency) {
  const visited = new Set();
  const components = [];

  const allNodes = Array.from(nodes).sort();

  for (const start of allNodes) {
    if (visited.has(start)) continue;

    const stack = [start];
    const componentSet = new Set();
    visited.add(start);

    while (stack.length) {
      const node = stack.pop();
      componentSet.add(node);

      const neighbors = undirected.get(node) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }

    const componentNodes = sortedComponent(componentSet);
    components.push({
      nodes: componentNodes,
      has_cycle: hasDirectedCycle(componentNodes, adjacency)
    });
  }

  return components;
}
