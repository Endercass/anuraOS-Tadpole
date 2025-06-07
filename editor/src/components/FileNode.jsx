export default function FileNode() {
  this.css = `
  font-family: monospace;
  font-size: 14px;
  ${!this.isRoot && "padding-left: 12px"};
  line-height: 1.6;

  .file, summary {
    display: block;
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;
    color: #333;
  }

  .file:hover,
  summary:hover {
    background-color: #f0f4f8;
    color: #000;
  }

  summary {
    list-style: none;
    outline: none;
  }

  details > summary::marker,
  details > summary::-webkit-details-marker {
    display: none;
  }

  details > summary::before {
    content: "▸";
    display: inline-block;
    margin-right: 6px;
    transform: rotate(0deg);
    transition: transform 0.2s ease;
  }

  details[open] > summary::before {
    transform: rotate(90deg);
  }
`;

  this.openedFolder ??= "/";
  this.fileTree ??= [];
  this.onNavigate ??= (path) => console.log("Navigated to:", path);
  this.expanded ??= new Set();

  useChange(this.openedFolder, async (folder) => {
    try {
      const entries = folder
        ? await Promise.all(
            (
              await anura.fs.promises.readdir(folder)
            ).map((name) => anura.fs.promises.stat(`${folder}/${name}`)),
          )
        : [];
      this.fileTree = entries.map((e) => ({
        name: e.name,
        type: e.type,
        fullPath: `${folder}/${e.name}`,
      }));
    } catch (err) {
      console.error("Error reading directory:", err);
      this.fileTree = [];
    }
  });

  return (
    <div class="file-tree">
      {use(this.fileTree, (entries) => [
        ...entries.map((entry) =>
          entry.type === "DIRECTORY" ? (
            <details
              open={this.expanded.has(entry.fullPath)}
              on:toggle={(e) => {
                const path = entry.fullPath;
                if (e.currentTarget.open) this.expanded.add(path);
                else this.expanded.delete(path);
                this.expanded = this.expanded;
              }}
            >
              <summary>{entry.name}</summary>
              {use(this.expanded, (set) =>
                set.has(entry.fullPath) ? (
                  <FileNode
                    openedFolder={entry.fullPath}
                    onNavigate={this.onNavigate}
                  />
                ) : (
                  ""
                ),
              )}
            </details>
          ) : (
            <div class="file" on:click={() => this.onNavigate(entry.fullPath)}>
              {entry.name}
            </div>
          ),
        ),
      ])}
    </div>
  );
}
