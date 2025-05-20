export const name = "PlainGreeter";

export default function PlainGreeter() {
  return html`<div>
    <h2>Plain Greeter</h2>
    <p>Hello, ${use(this.name)}!</p>
  </div>`;
}
