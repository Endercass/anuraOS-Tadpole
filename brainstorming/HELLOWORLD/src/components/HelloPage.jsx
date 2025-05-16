const HelloDescription = await getComponent("HelloDescription");

export const name = "HelloPage";

export default function HelloPage() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <HelloDescription />
    </div>
  );
}
