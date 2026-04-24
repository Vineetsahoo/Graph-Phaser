import { parseEntries } from '../../lib/parser';
import { buildGraph } from '../../lib/graphBuilder';
import { analyzeComponents } from '../../lib/cycleDetector';
import { buildHierarchy } from '../../lib/treeBuilder';
import { generateSummary } from '../../lib/summary';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function applyCors(res) {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

export default function handler(req, res) {
  applyCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      is_success: false,
      error: 'Invalid JSON body. Expected: { "data": ["A->B"] }'
    });
  }

  if (!Array.isArray(req.body.data)) {
    return res.status(400).json({
      is_success: false,
      error: 'Field "data" is required and must be an array.'
    });
  }

  if (req.body.data.length > 50) {
    return res.status(400).json({
      is_success: false,
      error: 'Maximum 50 edges allowed per request.'
    });
  }

  const { valid_edges, invalid_entries, duplicate_edges } = parseEntries(req.body?.data);
  const { nodes, adjacency, treeAdjacency, undirected, parentOf } = buildGraph(valid_edges);
  const components = analyzeComponents(nodes, undirected, adjacency);
  const hierarchies = buildHierarchy(components, treeAdjacency, parentOf);
  const summary = generateSummary(hierarchies);

  return res.status(200).json({
    user_id: 'vineet_sahoo_24092005',
    email_id: 'vs1023@srmist.edu.in',
    college_roll_number: 'RA2311033010053',
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary
  });
}
