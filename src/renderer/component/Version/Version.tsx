import React from "react";
import { version } from "../../../../package.json";

function Version() {
  return <div className="text-center">Bazecor v{version}</div>;
}

export default Version;
