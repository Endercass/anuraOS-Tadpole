import FileNode from "./FileNode.jsx";

export default function FileTree() {
  this.css = `
    border: 1px solid #d0d0d0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 12px;
    background-color: #ffffff;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    max-height: 400px;
    overflow-y: auto;
  `;

  this.openedFolder ??= "/";
  this.onNavigate ??= (path) => console.log("Navigated to:", path);

  return (
    <div>
      <FileNode
        isRoot={true}
        bind:openedFolder={use(this.openedFolder)}
        bind:onNavigate={use(this.onNavigate)}
      />
    </div>
  );
}
