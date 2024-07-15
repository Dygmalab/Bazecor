import React from "react";

interface OSKeyProps {
  key: string;
}

const OSKey = ({ key }: OSKeyProps) => {
  const keyInternal = key;
  return <div className="key">div</div>;
};

export default OSKey;
