const Item = ({ item, remove }) => {
  return (
    <li style={{ padding: 10, borderBottom: "1px solid #ddd" }}>
      <span>
        {item.content} -<b>{item.name}</b>
      </span>
      <button onClick={() => remove(item.id)}>Delete</button>
    </li>
  );
};

export default Item;
