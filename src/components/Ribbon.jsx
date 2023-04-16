export default function Ribbon ({ status, isWanted, price }) {
  const updateRibbonText = () => {
    if (isWanted) {
      return "Wanted";
    } else {
      if (status === "available") {
        return `$${price}`;
      } else if (status === "pending") {
        return `$${price} PPU`;
      }
      return status.toUpperCase();
    }
  };
  return (
    <p
      className={`ribbon-banner ${
        isWanted ? "" : status === "available" ? " green" : status === "sold" ? "red" : "yellow"
      }`}>
      {updateRibbonText()}
    </p>
  );
};