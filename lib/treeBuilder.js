function buildNestedTree(node, treeAdjacency, inComponent, visiting = new Set()) {
  if (visiting.has(node)) {
    return {};
  }

  visiting.add(node);

  const result = {};
  const children = Array.from(treeAdjacency.get(node) || []).filter((child) => inComponent.has(child)).sort();

  for (const child of children) {
    result[child] = buildNestedTree(child, treeAdjacency, inComponent, new Set(visiting));
  }

  return result;
}

function longestDepth(node, treeAdjacency, inComponent, visiting = new Set()) {
  if (visiting.has(node)) {
    return 0;
  }

  visiting.add(node);

  const children = Array.from(treeAdjacency.get(node) || []).filter((child) => inComponent.has(child));

  if (children.length === 0) {
    return 1;
  }

  let bestChildDepth = 0;
  for (const child of children) {
    bestChildDepth = Math.max(bestChildDepth, longestDepth(child, treeAdjacency, inComponent, new Set(visiting)));
  }

  return 1 + bestChildDepth;
}

function findRoots(componentNodes, parentOf) {
  const nodeSet = new Set(componentNodes);

  const roots = componentNodes.filter((node) => {
    const parent = parentOf.get(node);
    return !parent || !nodeSet.has(parent);
  });

  return roots.sort();
}

export function buildHierarchy(components, treeAdjacency, parentOf) {
  const hierarchies = [];

  for (const component of components) {
    const { nodes, has_cycle } = component;

    if (has_cycle) {
      // In a pure cycle every node has a parent, so fallback to the smallest label.
      const roots = findRoots(nodes, parentOf);
      const root = roots.length > 0 ? roots[0] : [...nodes].sort()[0];

      hierarchies.push({
        root,
        nodes,
        has_cycle: true,
        tree: {}
      });

      continue;
    }

    const inComponent = new Set(nodes);
    const roots = findRoots(nodes, parentOf);

    // Non-cyclic components with first-parent resolution can become a forest.
    // Return one hierarchy object per root to match the challenge contract.
    for (const root of roots) {
      const tree = { [root]: buildNestedTree(root, treeAdjacency, inComponent) };
      const depth = longestDepth(root, treeAdjacency, inComponent);

      hierarchies.push({
        root,
        nodes,
        tree,
        depth
      });
    }
  }

  return hierarchies;
}
