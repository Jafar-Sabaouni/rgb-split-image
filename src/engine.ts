import { useRef, useEffect, useCallback } from "react";
import { RGBEffect } from "./types";

interface EngineConfig {
  idleEffect: RGBEffect;
  onHover: RGBEffect;
  onClick: RGBEffect;
  onMount?: RGBEffect;
  effectDuration: number;
  effectIntensity: number;
  breatheSpeed: number;
  splitDistance: number;
  trackWindowMouse: boolean;
  disabled: boolean;
}

interface ChannelOffsets {
  r: { x: number; y: number };
  g: { x: number; y: number };
}

// Math helpers
const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

export function useEffectEngine(config: EngineConfig) {
  // References to the DOM elements representing the R and G channels to directly mutate their transforms
  // for high performance, bypassing React state updates during the animation loop.
  const rChannelRef = useRef<HTMLElement | null>(null);
  const gChannelRef = useRef<HTMLElement | null>(null);

  // State Machine Tracking
  const animationFrameId = useRef<number>();
  const isHovered = useRef(false);
  const tempEffectEndTime = useRef(0);
  const activeTempEffect = useRef<RGBEffect>("none");
  const mousePos = useRef({ x: 0, y: 0 }); // Normalized -1 to 1
  const targetMousePos = useRef({ x: 0, y: 0 });

  // Current logical offsets to allow smooth lerping
  const currentOffsets = useRef<ChannelOffsets>({
    r: { x: 0, y: 0 },
    g: { x: 0, y: 0 },
  });

  // Keep config in a stable ref so the animation loop doesn't recreate on every render
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const triggerTempEffect = useCallback((effect: RGBEffect) => {
    if (effect === "none") return;
    activeTempEffect.current = effect;
    tempEffectEndTime.current = Date.now() + configRef.current.effectDuration;
  }, []);

  // Handle Mount Effect
  useEffect(() => {
    if (configRef.current.onMount && configRef.current.onMount !== "none") {
      triggerTempEffect(configRef.current.onMount);
    }
  }, [triggerTempEffect]);

  // Determine the active effect based on Priority:
  // 1. Temporary events triggered recently
  // 2. Continuous hover events
  // 3. Idle effect
  const getActiveEffect = (now: number): RGBEffect => {
    if (
      now < tempEffectEndTime.current &&
      activeTempEffect.current !== "none"
    ) {
      return activeTempEffect.current;
    }
    if (isHovered.current && configRef.current.onHover !== "none")
      return configRef.current.onHover;
    return configRef.current.idleEffect;
  };

  const loop = useCallback((timestamp: number) => {
    const now = Date.now();
    const activeEffect = getActiveEffect(now);
    const currentConfig = configRef.current;

    let targetR = { x: 0, y: 0 };
    let targetG = { x: 0, y: 0 };

    if (!currentConfig.disabled) {
      // Determine base intensity by checking if active effect relies on effectIntensity vs standard distance
      const isTemporary =
        now < tempEffectEndTime.current &&
        activeEffect === activeTempEffect.current;
      const appliedDistance = isTemporary
        ? currentConfig.splitDistance * currentConfig.effectIntensity
        : currentConfig.splitDistance;

      if (activeEffect === "glitch") {
        targetR = {
          x: (Math.random() - 0.5) * appliedDistance,
          y: (Math.random() - 0.5) * appliedDistance,
        };
        targetG = {
          x: (Math.random() - 0.5) * appliedDistance,
          y: (Math.random() - 0.5) * appliedDistance,
        };
      } else if (activeEffect === "breathe") {
        const t = timestamp * 0.001 * currentConfig.breatheSpeed;
        targetR = {
          x: Math.sin(t) * (appliedDistance * 0.5),
          y: Math.cos(t * 0.8) * (appliedDistance * 0.5),
        };
        targetG = {
          x: Math.cos(t * 1.1) * (appliedDistance * 0.5),
          y: Math.sin(t * 0.9) * (appliedDistance * 0.5),
        };
      } else if (activeEffect === "followMouse") {
        // Smooth mouse following
        mousePos.current.x = lerp(
          mousePos.current.x,
          targetMousePos.current.x,
          0.1,
        );
        mousePos.current.y = lerp(
          mousePos.current.y,
          targetMousePos.current.y,
          0.1,
        );

        targetR = {
          x: mousePos.current.x * appliedDistance,
          y: mousePos.current.y * appliedDistance,
        };
        targetG = {
          x: -mousePos.current.x * appliedDistance,
          y: -mousePos.current.y * appliedDistance,
        };
      }
    }

    // Smoothly interpolate current offsets to target unless it's a glitch (glitch is snap)
    const lerpFactor = activeEffect === "glitch" ? 1 : 0.15;

    currentOffsets.current.r.x = lerp(
      currentOffsets.current.r.x,
      targetR.x,
      lerpFactor,
    );
    currentOffsets.current.r.y = lerp(
      currentOffsets.current.r.y,
      targetR.y,
      lerpFactor,
    );
    currentOffsets.current.g.x = lerp(
      currentOffsets.current.g.x,
      targetG.x,
      lerpFactor,
    );
    currentOffsets.current.g.y = lerp(
      currentOffsets.current.g.y,
      targetG.y,
      lerpFactor,
    );

    // Apply directly to DOM nodes
    if (rChannelRef.current) {
      rChannelRef.current.style.transform = `translate(${currentOffsets.current.r.x}px, ${currentOffsets.current.r.y}px)`;
    }
    if (gChannelRef.current) {
      gChannelRef.current.style.transform = `translate(${currentOffsets.current.g.x}px, ${currentOffsets.current.g.y}px)`;
    }

    animationFrameId.current = requestAnimationFrame(loop);
  }, []); // Dependencies are stable refs

  // Start the animation loop
  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [loop]);

  // Event handlers to interact with the engine state
  const handleMouseEnter = useCallback(() => {
    isHovered.current = true;
    if (configRef.current.onHover === "glitch") triggerTempEffect("glitch");
  }, [triggerTempEffect]);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
    if (!configRef.current.trackWindowMouse) {
      targetMousePos.current = { x: 0, y: 0 }; // Reset center
    }
  }, []);

  const handleMouseMove = useCallback(
    (
      e: React.MouseEvent<HTMLElement> | MouseEvent,
      containerNode?: HTMLElement | null,
    ) => {
      if (!configRef.current.trackWindowMouse && !isHovered.current) return;

      const node = containerNode || (e.currentTarget as HTMLElement);
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize to -1 to 1 based on distance from center
      let nx = (e.clientX - centerX) / (rect.width / 2);
      let ny = (e.clientY - centerY) / (rect.height / 2);

      // Clamp magnitude to 1 so the split distance doesn't exceed the intended maximum
      const distance = Math.sqrt(nx * nx + ny * ny);
      if (distance > 1) {
        nx /= distance;
        ny /= distance;
      }

      targetMousePos.current.x = nx;
      targetMousePos.current.y = ny;
    },
    [],
  );

  const handleClick = useCallback(() => {
    if (configRef.current.onClick && configRef.current.onClick !== "none") {
      triggerTempEffect(configRef.current.onClick);
    }
  }, [triggerTempEffect]);

  return {
    rChannelRef,
    gChannelRef,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
      onClick: handleClick,
    },
  };
}
