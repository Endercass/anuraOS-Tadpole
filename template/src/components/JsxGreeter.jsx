export const name = "JsxGreeter";

export default function JsxGreeter() {
  return (
    <div>
      <h2>Jsx Greeter</h2>
      <p>Hello, {use(this.name)}!</p>
    </div>
  );
}
