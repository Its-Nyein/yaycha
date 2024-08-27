export default function Item({ content, name }) {
  return (
    <li style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
      {content} -<b>{name}</b>
    </li>
  );
}
