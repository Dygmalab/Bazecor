import React from "react";
import { version } from "../../../../package.json";

function Version() {
  return <div className="text-center mb-4">Bazecor v{version}</div>;
}

export default Version;
