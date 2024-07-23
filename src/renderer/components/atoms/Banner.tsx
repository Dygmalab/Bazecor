import React from "react";

interface BannerProps {
  variant?: "warning" | "danger" | "success" | "info";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const Banner = ({ variant = "info", icon, children }: BannerProps) => (
  <div
    className={`rounded-md px-8 py-6 text-gray-600 dark:text-gray-100 ${variant} [&_p]:font-normal [&_p]:text-sm [&_p]:last-of-type:mb-0 ${
      variant === "warning" ? "bg-warningBanner dark:bg-warningBannerDark border-[1px] border-orange-200/25" : ""
    }`}
  >
    <div className="banner-inner flex gap-6">
      {icon && (
        <div
          className={`banner-icon flex flex-shrink-0 flex-grow-0 basis-10 w-10 h-10 items-center justify-center rounded-full bg-orange-100/35 dark:bg-orange-100/15 ${variant === "warning" ? "text-orange-200" : ""}`}
        >
          {icon}
        </div>
      )}
      <div className="banner-content">{children}</div>
    </div>
  </div>
);

export default Banner;
