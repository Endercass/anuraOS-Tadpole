const BlocklyGreeter = await getComponent("BlocklyGreeter");
const PlainGreeter = await getComponent("PlainGreeter");
const JsxGreeter = await getComponent("JsxGreeter");

export const name = "App";

export default function App() {
  this.name = "World";

  return html`<div style="color: #fff;">
    <h1>Hello, World!</h1>
    <p>
      This is a template for creating an Anura Tadpole app with plain
      javascript. This template contains a greeter component in every
      implemented language.
    </p>
    <input on:input=${(e) => (this.name = e.target.value)} value=${this.name} />
    <div>
      <${BlocklyGreeter} name=${use(this.name)} />
    </div>
    <div>
      <${PlainGreeter} name=${use(this.name)} />
    </div>
    <div>
      <${JsxGreeter} name=${use(this.name)} />
    </div>
  </div>`;
}
