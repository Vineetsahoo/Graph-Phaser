function pushToMapSet(map, key, value) {
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key).add(value);
}

function mapSetToSortedObject(map) {
  const obj = {};
  const keys = Array.from(map.keys()).sort();

  for (const key of keys) {
    obj[key] = Array.from(map.get(key)).sort();
  }

  return obj;
}

export function buildGraph(valid_edges) {
  const nodes = new Set();
  const adjacency = new Map();
  const treeAdjacency = new Map();
  const undirected = new Map();
  const parentOf = new Map();

  for (const { from, to } of valid_edges) {
    nodes.add(from);
    nodes.add(to);

    pushToMapSet(adjacency, from, to);
    if (!adjacency.has(to)) {
      adjacency.set(to, new Set());
    }

    pushToMapSet(undirected, from, to);
    pushToMapSet(undirected, to, from);

    if (!parentOf.has(to)) {
      parentOf.set(to, from);
      pushToMapSet(treeAdjacency, from, to);
      if (!treeAdjacency.has(to)) {
        treeAdjacency.set(to, new Set());
      }
    }
  }

  for (const node of nodes) {
    if (!adjacency.has(node)) adjacency.set(node, new Set());
    if (!treeAdjacency.has(node)) treeAdjacency.set(node, new Set());
    if (!undirected.has(node)) undirected.set(node, new Set());
  }

  return {
    nodes,
    adjacency,
    treeAdjacency,
    undirected,
    parentOf,
    adjacency_view: mapSetToSortedObject(adjacency)
  };
}
