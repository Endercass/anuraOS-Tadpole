const PlainHelloDescription = await getComponent("PlainHelloDescription");

export const name = "PlainHelloPage";

export default function PlainHelloPage() {
  return html`
    <div>
      <h1>Hello, World!</h1>
      <${PlainHelloDescription} />
    </div>
  `;
}
