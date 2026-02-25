import React from "react";

export type RGBEffect = "none" | "breathe" | "followMouse" | "glitch";

export type BaseRGBSplitImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onClick"
> & {
  // Core
  src: string;
  alt?: string;

  // Configuration
  splitDistance?: number; // Max px distance the RGB channels can separate (default: 40)
  colorSpace?: "rgb" | "cmyk"; // Determines the underlying SVG Color Matrix (default: 'rgb')
  grayscale?: boolean; // Converts the image to grayscale before applying the RGB split
  disableOnMobile?: boolean; // Disables effect on narrow viewports for performance (default: false)

  // Framework Agnostic Wrapper
  as?: React.ElementType;
  onImageClick?: React.MouseEventHandler<HTMLElement>;
};

export type RGBSplitImageProps<
  I extends RGBEffect | undefined = undefined,
  H extends RGBEffect | undefined = undefined,
  C extends RGBEffect | undefined = undefined,
  M extends RGBEffect | undefined = undefined,
> = BaseRGBSplitImageProps & {
  // 1. The Default/Idle State
  idleEffect?: I;

  // 2. The Triggers & Their Effects
  onHover?: H;
  onClick?: C;
  onMount?: M;
} &
  // 3a. Breathe Speed only allowed if an effect uses 'breathe'
  ("breathe" extends I | H | C | M
    ? { breatheSpeed?: number }
    : { breatheSpeed?: never }) &
  // 3b. trackWindowMouse only allowed if an effect uses 'followMouse'
  ("followMouse" extends I | H | C | M
    ? { trackWindowMouse?: boolean }
    : { trackWindowMouse?: never }) &
  // 3c. duration & intensity only allowed if a temporary effect (onClick/onMount) is active
  (Exclude<C | M, undefined | "none"> extends never
    ? { effectDuration?: never; effectIntensity?: never }
    : { effectDuration?: number; effectIntensity?: number });
