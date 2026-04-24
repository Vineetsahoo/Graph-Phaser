import { useMemo, useState } from 'react';

function parseInputToArray(rawText) {
  return rawText
    .split(/[,\n]/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function Chip({ text, variant = 'neutral' }) {
  const palette = {
    neutral: 'bg-swiss-bg text-swiss-fg border-swiss-border',
    danger: 'bg-swiss-accent text-swiss-bg border-swiss-border',
    warning: 'bg-swiss-muted text-swiss-fg border-swiss-border'
  };

  return (
    <span className={`inline-flex min-h-11 items-center border-2 px-3 py-2 text-xs font-bold uppercase tracking-widest ${palette[variant]}`}>
      {text}
    </span>
  );
}

function TreeNode({ nodeKey, subtree, level = 0 }) {
  const children = Object.entries(subtree || {});

  return (
    <div className="relative" style={{ marginLeft: level > 0 ? 20 : 0 }}>
      <div className="mb-2 inline-flex min-h-11 items-center gap-2 border-2 border-swiss-border bg-swiss-bg px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors duration-150 ease-linear hover:bg-swiss-accent hover:text-swiss-bg">
        <span className="h-2 w-2 bg-swiss-fg" />
        <span>{nodeKey}</span>
      </div>
      {children.length > 0 ? (
        <div className="border-l-2 border-swiss-border pl-4">
          {children.map(([childName, childTree]) => (
            <TreeNode key={`${nodeKey}-${childName}`} nodeKey={childName} subtree={childTree} level={level + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function HierarchyCard({ hierarchy }) {
  const isCycle = hierarchy.has_cycle;
  const rootEntry = Object.entries(hierarchy.tree || {})[0];

  return (
    <article className={`border-4 border-swiss-border p-6 transition-all duration-150 ease-linear ${isCycle ? 'bg-swiss-accent text-swiss-bg' : 'bg-swiss-bg swiss-grid-pattern'}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-2xl font-black uppercase tracking-tight">Root: {hierarchy.root}</h3>
        <Chip text={isCycle ? 'Cyclic Component' : 'Hierarchy Tree'} variant={isCycle ? 'danger' : 'neutral'} />
      </div>

      {isCycle ? (
        <p className="max-w-lg text-sm font-medium uppercase tracking-wide">
          Cycle detected in this component. Tree expansion is disabled by challenge rules.
        </p>
      ) : (
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest">Depth: {hierarchy.depth}</p>
          {rootEntry ? <TreeNode nodeKey={rootEntry[0]} subtree={rootEntry[1]} /> : null}
        </div>
      )}
    </article>
  );
}

export default function Home() {
  const [inputText, setInputText] = useState('A->B, B->C, A->D, D->E, E->F, G->H, H->G, C->C, A->B');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSubmittedInput, setLastSubmittedInput] = useState('');

  const parsedPreview = useMemo(() => parseInputToArray(inputText), [inputText]);
  const hasUnsubmittedChanges = result && inputText.trim() !== lastSubmittedInput.trim();

  async function handleSubmit(event) {
    if (event?.preventDefault) {
      event.preventDefault();
    }
    setError('');
    setLoading(true);

    try {
      const payload = { data: parseInputToArray(inputText) };
      const response = await fetch('/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const body = await response.json();
      setResult(body);
      setLastSubmittedInput(inputText);
    } catch (err) {
      setError(err.message || 'Something went wrong while calling the API.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="swiss-noise min-h-screen bg-swiss-bg px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1240px] border-4 border-swiss-border bg-swiss-bg">
        <header className="border-b-4 border-swiss-border px-5 py-8 sm:px-10 sm:py-12">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-swiss-accent">01. Full Stack Challenge / Graph Parser</p>
          <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-7xl lg:text-8xl">
            Hierarchy
            <br />
            Analysis
            <br />
            System
          </h1>
          <p className="mt-6 max-w-2xl border-l-4 border-swiss-border pl-4 text-sm font-medium uppercase leading-6 tracking-wide sm:text-base">
            Input directed edges in format X-&gt;Y. The engine validates, removes duplicates, resolves first-parent trees,
            detects cycles per component, and returns deterministic hierarchy output.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-12">
          <div className="border-b-4 border-swiss-border bg-swiss-muted swiss-grid-pattern p-5 lg:col-span-8 lg:border-b-0 lg:border-r-4 lg:p-8">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-swiss-accent">02. Input</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label htmlFor="edgeInput" className="block text-sm font-bold uppercase tracking-widest">
                Node Edges (comma or newline)
              </label>
              <textarea
                id="edgeInput"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                rows={8}
                className="w-full border-4 border-swiss-border bg-swiss-bg p-4 font-mono text-sm leading-6 outline-none transition-colors duration-150 ease-linear focus:border-swiss-accent"
                placeholder="A->B, B->C, C->D"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-xs uppercase tracking-widest">Tokens: {parsedPreview.length}</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-11 border-4 border-swiss-border bg-swiss-fg px-6 py-2 font-display text-sm font-bold uppercase tracking-[0.18em] text-swiss-bg transition-colors duration-150 ease-linear hover:bg-swiss-accent disabled:cursor-not-allowed disabled:bg-swiss-muted disabled:text-swiss-fg"
                >
                  {loading ? 'Processing...' : 'Submit /bfhl'}
                </button>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-swiss-fg/80">
                Tip: Results update only after submit. Use Ctrl+Enter for quick submit.
              </p>
            </form>
            {error ? <p className="mt-4 border-2 border-swiss-border bg-swiss-accent px-3 py-2 text-sm font-bold uppercase tracking-wide text-swiss-bg">{error}</p> : null}
            {hasUnsubmittedChanges ? (
              <p className="mt-3 border-2 border-swiss-border bg-swiss-muted px-3 py-2 text-xs font-bold uppercase tracking-widest">
                Input changed. Submit to refresh analysis.
              </p>
            ) : null}
          </div>

          <aside className="swiss-dots p-5 lg:col-span-4 lg:p-8">
            <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-swiss-accent">03. Rules</p>
            <ul className="space-y-3 text-sm font-semibold uppercase tracking-wide">
              <li>Format must match A-&gt;B.</li>
              <li>Self loops move to invalid entries.</li>
              <li>Duplicate edges counted once.</li>
              <li>Cycles return empty tree object.</li>
              <li>Largest tree root uses depth + lexical tie break.</li>
            </ul>
          </aside>
        </section>

        {result ? (
          <section className="border-t-4 border-swiss-border">
            <div className="border-b-4 border-swiss-border bg-swiss-muted swiss-diagonal px-5 py-6 sm:px-8">
              <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-swiss-accent">04. Summary</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="border-4 border-swiss-border bg-swiss-bg p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Total Trees</p>
                  <p className="mt-2 font-display text-4xl font-black leading-none">{result.summary.total_trees}</p>
                </div>
                <div className="border-4 border-swiss-border bg-swiss-bg p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Total Cycles</p>
                  <p className="mt-2 font-display text-4xl font-black leading-none">{result.summary.total_cycles}</p>
                </div>
                <div className="border-4 border-swiss-border bg-swiss-bg p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Largest Root</p>
                  <p className="mt-2 font-display text-4xl font-black leading-none">{result.summary.largest_tree_root || '-'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="border-b-4 border-swiss-border p-5 lg:col-span-4 lg:border-b-0 lg:border-r-4 lg:p-8">
                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-swiss-accent">05. Validation</p>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest">Invalid Entries</p>
                <div className="mb-5 flex flex-wrap gap-2">
                  {result.invalid_entries.length > 0
                    ? result.invalid_entries.map((entry, index) => <Chip key={`inv-${index}-${entry}`} text={entry} variant="danger" />)
                    : <Chip text="None" variant="neutral" />}
                </div>

                <p className="mb-2 text-xs font-bold uppercase tracking-widest">Duplicate Edges</p>
                <div className="flex flex-wrap gap-2">
                  {result.duplicate_edges.length > 0
                    ? result.duplicate_edges.map((edge, index) => <Chip key={`dup-${index}-${edge}`} text={edge} variant="warning" />)
                    : <Chip text="None" variant="neutral" />}
                </div>
              </div>

              <div className="p-5 lg:col-span-8 lg:p-8">
                <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-swiss-accent">06. Components</p>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {result.hierarchies.map((hierarchy, index) => (
                    <HierarchyCard key={`${hierarchy.root}-${hierarchy.has_cycle}-${index}`} hierarchy={hierarchy} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
