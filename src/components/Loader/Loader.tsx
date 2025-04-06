import React from "react";
import "./Loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="debt-market__loader">
      <div className="spinner"></div> Ładowanie...
    </div>
  );
};

export default Loader;
