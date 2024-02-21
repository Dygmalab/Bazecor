declare module "*.gif";
declare module "*.jpg";
declare module "*.mp4";
declare module "*.png";
declare module "*.gif";
declare module "*.svg";

declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      xmlns?: string; // Add any other specific attributes you need
    };
  }
}
