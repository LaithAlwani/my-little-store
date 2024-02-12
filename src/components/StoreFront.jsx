import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Boardgame from "./Boardgame";
import { XMLParser } from "fast-xml-parser";
import Loader from "./Loader";
import { FaFacebookF, FaFacebookMessenger, FaLocationDot } from "react-icons/fa6";

export default function StoreFront({ user }) {
  const [boardgames, setBoardgames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState();
  const { username, fbHandle, area, postalCode } = user;

  useEffect(() => {
    setLoading(true);
    fetch(`https://boardgamegeek.com/xmlapi2/collection?username=${username}`)
      .then((res) => res.text())
      .then((data) => {
        const parser = new XMLParser({ ignoreAttributes: false });
        const { items } = parser.parse(data);
        setLastUpdated(items["@_pubdate"]);
        user.lastUpdated = items["@_pubdate"];
        if (items.item) {
          const tradeList = items.item.filter((game) => game.status["@_fortrade"] === "1");
          setBoardgames([]);
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
          toast.error("please try again");
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <div className="loader-container">
      <Loader />
    </div>
  ) : (
    <>
      <h2>
        {username}{" "}
        <a href={`https://facebook.com/${fbHandle}`} target="_blank">
          <FaFacebookF />
          </a>
          {" "}
        <a href={`https://m.me/${fbHandle}`} target="_blank">
          <FaFacebookMessenger />
          </a>
          {" "}
        <a href={`http://google.com/maps?q=${postalCode}`} target="_blank">
          <FaLocationDot />
        </a>
      </h2>
      <div className="container gamelist">
        {boardgames.map((game, i) => (
          <Boardgame key={i} game={game} />
        ))}
      </div>
      <span>location: {area}</span>
      <p>last updated:{lastUpdated}</p>
    </>
  );
}
