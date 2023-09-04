import React from "react";

interface RegularButtonProps {
  selected?: boolean;
  onClick?: () => void;
  size?: string;
  children: React.ReactNode;
  variation?: string;
  icoSVG?: React.ReactNode;
  icoPosition?: "left" | "right" | undefined;
  disabled?: boolean;
}
const RegularButtonFwRef = React.forwardRef(
  (
    { selected, onClick, size, children, variation, icoSVG, icoPosition, disabled }: RegularButtonProps,
    ref?: React.ForwardedRef<HTMLButtonElement>,
  ) => (
    <button
      type="button"
      onClick={disabled ? () => {} : onClick}
      className={`${size || ""} ${selected ? "active" : ""} button ${variation && variation} iconOn${icoPosition || "None"}`}
      disabled={disabled}
      tabIndex={0}
      ref={ref}
    >
      <div className="buttonLabel">
        {icoSVG && icoPosition !== "right" ? icoSVG : ""}
        <span className="buttonText">{children}</span>
        {icoSVG && icoPosition === "right" ? icoSVG : ""}
      </div>
      <div className="buttonFX" />
    </button>
  ),
);

export default RegularButtonFwRef;
