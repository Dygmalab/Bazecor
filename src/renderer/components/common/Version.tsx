import React from "react";
import { version } from "../../../../package.json";

function Version() {
  return (
    <div className="text-center text-xs tracking-tight font-semibold px-4 py-4">
      <a
        href={`https://github.com/Dygmalab/Bazecor/releases/tag/v${version}`}
        className="text-gray-400 dark:text-gray-100"
      >{`Bazecor v${version}`}</a>
    </div>
  );
}

export default Version;
