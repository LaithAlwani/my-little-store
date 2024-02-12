export default function Boardgame({ game }) {
  const {
    id,
    name,
    thumbnail,
    bggLink,
  } = game;

  return (
    game && (
      <div className="bg-container">
        <a href={bggLink} target="_blank" key={id} className="img-container">
          <img src={thumbnail} alt={name} className="bg-image" />
          <h4>{name}</h4>
        </a>
      </div>
    )
  );
}
