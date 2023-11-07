import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
  icon: React.ReactNode;
  iconPosition?: "left" | "right" | boolean;
}

const Button = ({
  children,
  onClick,
  active = false,
  disabled = false,
  size = "md",
  variant = "primary",
  icon,
  iconPosition = false,
}: ButtonProps) => (
  <button
    type="button"
    onClick={disabled ? () => {} : onClick}
    className={`button ${size || ""} ${active ? "active" : ""} ${variant && variant} iconOn${iconPosition || "none"}`}
    disabled={disabled}
    tabIndex={0}
  >
    <div className="flex items-center gap-2.5 relative z-[2]">
      {icon && iconPosition !== "right" ? icon : ""}
      <span className={`text-${size}`}>{children}</span>
      {icon && iconPosition === "right" ? icon : ""}
    </div>
  </button>
);

export default Button;
