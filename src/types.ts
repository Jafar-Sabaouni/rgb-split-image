import React from "react";

export type RGBEffect = "none" | "breathe" | "followMouse" | "glitch";

export type BaseRGBSplitImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onClick"
> & {
  src: string;
  alt?: string;

  /** Max pixel distance the RGB channels can separate (default: 40) */
  splitDistance?: number;
  /** Determines the underlying SVG color matrix: 'rgb' or 'cmyk' (default: 'rgb') */
  colorSpace?: "rgb" | "cmyk";
  /** Converts the image to grayscale before applying the RGB split (default: false) */
  grayscale?: boolean;
  /** Disables the effect on viewports <= 768px for performance (default: false) */
  disableOnMobile?: boolean;

  /** Render as a custom element (e.g. Next.js Image). Defaults to 'img' */
  as?: React.ElementType;
  /** Native click handler, since `onClick` is reserved for effect triggers */
  onImageClick?: React.MouseEventHandler<HTMLElement>;
};

export type RGBSplitImageProps<
  I extends RGBEffect | undefined = undefined,
  H extends RGBEffect | undefined = undefined,
  C extends RGBEffect | undefined = undefined,
  M extends RGBEffect | undefined = undefined,
> = BaseRGBSplitImageProps & {
  /** The default/idle effect when no interaction is happening */
  idleEffect?: I;
  /** Effect to apply while the user hovers over the image */
  onHover?: H;
  /** Effect to trigger on click (temporary, governed by effectDuration) */
  onClick?: C;
  /** Effect to trigger once on mount (temporary, governed by effectDuration) */
  onMount?: M;
} & ("breathe" extends I | H | C | M
    ? {
        /** Animation speed multiplier for the breathe effect (default: 1.0) */ breatheSpeed?: number;
      }
    : { breatheSpeed?: never }) &
  ("followMouse" extends I | H | C | M
    ? {
        /** Track the mouse cursor even outside the image boundaries (default: false) */ trackWindowMouse?: boolean;
      }
    : { trackWindowMouse?: never }) &
  (Exclude<C | M, undefined | "none"> extends never
    ? { effectDuration?: never; effectIntensity?: never }
    : {
        /** Duration of temporary effects (onClick, onMount) in ms (default: 1000) */
        effectDuration?: number;
        /** Distance multiplier for temporary effects (default: 1.5) */
        effectIntensity?: number;
      });
