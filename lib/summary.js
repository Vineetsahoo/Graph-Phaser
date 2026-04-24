export function generateSummary(hierarchies) {
  const nonCyclic = hierarchies.filter((item) => !item.has_cycle);
  const cyclic = hierarchies.filter((item) => item.has_cycle);

  let largest_tree_root = null;
  let bestDepth = -1;

  for (const tree of nonCyclic) {
    const depth = tree.depth || 0;

    if (depth > bestDepth) {
      bestDepth = depth;
      largest_tree_root = tree.root;
      continue;
    }

    if (depth === bestDepth && largest_tree_root && tree.root < largest_tree_root) {
      largest_tree_root = tree.root;
    }
  }

  return {
    total_trees: nonCyclic.length,
    total_cycles: cyclic.length,
    largest_tree_root
  };
}
