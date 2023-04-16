export default function Tag({ value, color }) {
  return (
    value && (
      <span className="tag" style={{ background: color }}>
        {value}
      </span>
    )
  );
}
