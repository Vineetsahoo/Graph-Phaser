const EDGE_PATTERN = /^[A-Z]->[A-Z]$/;

export function parseEntries(data) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const valid_edges = [];

  if (!Array.isArray(data)) {
    return {
      valid_edges,
      invalid_entries: ['Body field "data" must be an array of strings.'],
      duplicate_edges
    };
  }

  const seenEdges = new Set();
  const reportedDuplicates = new Set();

  for (const rawEntry of data) {
    const entry = String(rawEntry ?? '').trim();

    if (!EDGE_PATTERN.test(entry)) {
      invalid_entries.push(entry || String(rawEntry));
      continue;
    }

    const [from, to] = entry.split('->');

    if (from === to) {
      invalid_entries.push(entry);
      continue;
    }

    if (seenEdges.has(entry)) {
      if (!reportedDuplicates.has(entry)) {
        duplicate_edges.push(entry);
        reportedDuplicates.add(entry);
      }
      continue;
    }

    seenEdges.add(entry);
    valid_edges.push({ from, to, edge: entry });
  }

  return { valid_edges, invalid_entries, duplicate_edges };
}
