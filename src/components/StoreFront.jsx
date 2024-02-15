import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Boardgame from "./Boardgame";
import { XMLParser } from "fast-xml-parser";
import Loader from "./Loader";
import { FaFacebookF, FaFacebookMessenger, FaLocationDot } from "react-icons/fa6";
import { SiBoardgamegeek } from "react-icons/si";

export default function StoreFront({ user }) {
  const [boardgames, setBoardgames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const { username, fbHandle, pickupLocation, postalcode } = user;
  
  useEffect(() => {
    setLoading(true);
    fetch(`https://boardgamegeek.com/xmlapi2/collection?username=${username}`)
      .then((res) => res.text())
      .then((data) => {
        const parser = new XMLParser({ ignoreAttributes: false });
        const { items } = parser.parse(data);
        if (items?.item) {
          const tradeList = items.item.filter((game) => game.status["@_fortrade"] === "1");
          setBoardgames([]);
          setLastUpdated(items["@_pubdate"]);
          tradeList.forEach((item) => {
            setBoardgames((prevState) => [
              ...prevState,
              {
                name: item.name["#text"],
                thumbnail: item.thumbnail,
                image: item.image,
                bggLink: `https://boardgamegeek.com/boardgame/${item["@_objectid"]}`,
                bggId: item["@_objectid"],
              },
            ]);
          });
        } else {
          toast.error("please refresh page");
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [boardgames.length <=0]);

  return loading ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : (
      boardgames.length > 0 &&
    <div className="user-collection">
      <h2>
        {username}
        {fbHandle && (
          <>
            <a href={`https://facebook.com/${fbHandle}`}>
              <FaFacebookF color="#316FF6" />
            </a>{" "}
            <a href={`https://m.me/${fbHandle}`}>
              <FaFacebookMessenger color="#316FF6" />
            </a>
          </>
        )}{" "}
        {postalcode && (
          <a href={`http://google.com/maps?q=${postalcode}`}>
            <FaLocationDot color="#EA4335" />
          </a>
        )}
        <a href={`https://boardgamegeek.com/user/${username}`}>
          <SiBoardgamegeek color="#ff5100" />
        </a>
        ({boardgames.length})
      </h2>
      <div className="container gamelist">
        {boardgames.map((game, i) => (
          <Boardgame key={i} game={game} />
        ))}
      </div>
      <strong>{pickupLocation}</strong>
      {lastUpdated && <p>last update {lastUpdated}</p>}
    </div>
  );
}
