import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline" | "purple";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right" | boolean;
  className?: string;
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
  className,
}: ButtonProps) => (
  // const buttonClasses = {
  //   primary:
  //     "px-6 py-4 rounded-md bg-linear bg-[length:300%] transition-all relative transform-style-3d before:absolute before:content-[''] before:w-[62px] before:h-[32px] before:bottom-[2px] before:left-[50%] before:bg-linearButton before:opacity-50 before:blur-[2px] before:transform before:translate-x-[-50%] before:translate-y-[0] before:translate-z-[-1px] before:transition-all before:ease-in-out before:duration-300 hover:cursor-pointer hover:bg-right hover:before:blur-lg hover:before:bottom-[-12px] hover:before:opacity-70 hover:before:w-[100px] aria-disabled:bg-buttonDisabled aria-disabled:text-gray-300 aria-disabled:before:content-none aria-disabled:bg-right aria-disabled:cursor-not-allowed text-gray-25 font-semibold tracking-tight",
  //   secondary:
  //     "px-6 py-4 rounded-md bg-[length:300%] transition-all relative transform-style-3d after:absolute after:content-[''] after:w-[62px] after:h-[32px] after:bottom-[2px] after:left-[50%] after:bg-linearButton after:opacity-50 after:blur-[2px] after:transform after:translate-x-[-50%] after:translate-y-[0] after:translate-z-[-1px] after:transition-all after:ease-in-out after:duration-300 hover:cursor-pointer hover:bg-right hover:after:blur-lg hover:after:bottom-[-12px] hover:after:opacity-70 hover:after:w-[100px] aria-disabled:bg-buttonDisabled aria-disabled:text-gray-300 aria-disabled:after:content-none aria-disabled:bg-right aria-disabled:cursor-not-allowed text-gray-25 font-semibold tracking-tight",
  //   outline:
  //     "px-6 py-4 rounded-md transition-all hover:cursor-pointer hover:bg-gray-400/40 text-gray-25 font-semibold tracking-tight",
  // };
  <button
    type="button"
    onClick={disabled ? () => {} : onClick}
    className={`button ${size || ""} ${active ? "active" : ""} tw-${variant} iconOn${iconPosition || "none"} ${className}`}
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
