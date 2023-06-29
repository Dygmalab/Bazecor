import * as React from "react";

function IconLeaf(props) {
  const pathHash = `${(Math.random() + 1).toString(36).substring(7)}`;
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g id="Leaf" clipPath={`url(#clip0_4160_258872)-${pathHash}`}>
        <path
          id="Leaf_2"
          d="M15.1798 19.668C12.6742 22.1737 8.74151 22.3826 5.9978 20.2949C5.74815 20.105 5.50834 19.896 5.28034 19.668C5.05233 19.44 4.84334 19.2001 4.65337 18.9505C2.56569 16.2068 2.77468 12.2741 5.28034 9.76848C8.01401 7.03481 18.7154 6.23295 18.7154 6.23295C18.7154 6.23295 17.9135 16.9343 15.1798 19.668Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          id="Center"
          d="M4.65722 18.9499C4.84719 19.1995 5.05618 19.4394 5.28419 19.6674C5.51219 19.8954 5.752 20.1043 6.00165 20.2943C7.50161 17.4499 10.5016 13.9499 14.5016 9.94986C9.30161 12.9239 6.50171 16.4498 4.65722 18.9499Z"
          stroke="currentColor"
        />
      </g>
      <defs>
        <clipPath id={`clip0_4160_258872-${pathHash}`}>
          <rect width="24" height="24" fill="white" transform="translate(0 0.450195)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconLeaf;
