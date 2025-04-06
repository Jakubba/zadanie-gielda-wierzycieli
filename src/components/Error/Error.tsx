import React from "react";
import "./Error.scss";
interface ErrorProps {
  message: string;
}

const Error: React.FC<ErrorProps> = ({ message }) => {
  return <div className="error-message">{message}</div>;
};

export default Error;
