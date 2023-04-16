import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function Store({ store }) {
  return (
    <div className="bg-container">
      <Link to={`${store.id}`}>
        <h3>{store.name}</h3>
      </Link>
      <div className="flex">
        {store.location && (
          <a href={store.location} target="_blank" className="location">
            <MdLocationOn size={32} />
          </a>
        )}
      </div>
    </div>
  );
}
