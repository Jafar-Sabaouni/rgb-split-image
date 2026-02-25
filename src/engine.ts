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

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

export function useEffectEngine(config: EngineConfig) {
  const rChannelRef = useRef<HTMLElement | null>(null);
  const gChannelRef = useRef<HTMLElement | null>(null);

  const animationFrameId = useRef<number>();
  const isHovered = useRef(false);
  const tempEffectEndTime = useRef(0);
  const activeTempEffect = useRef<RGBEffect>("none");
  const mousePos = useRef({ x: 0, y: 0 });
  const targetMousePos = useRef({ x: 0, y: 0 });

  const currentOffsets = useRef<ChannelOffsets>({
    r: { x: 0, y: 0 },
    g: { x: 0, y: 0 },
  });

  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const triggerTempEffect = useCallback((effect: RGBEffect) => {
    if (effect === "none") return;
    activeTempEffect.current = effect;
    tempEffectEndTime.current = Date.now() + configRef.current.effectDuration;
  }, []);

  useEffect(() => {
    if (configRef.current.onMount && configRef.current.onMount !== "none") {
      triggerTempEffect(configRef.current.onMount);
    }
  }, [triggerTempEffect]);

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

    if (rChannelRef.current) {
      rChannelRef.current.style.transform = `translate(${currentOffsets.current.r.x}px, ${currentOffsets.current.r.y}px)`;
    }
    if (gChannelRef.current) {
      gChannelRef.current.style.transform = `translate(${currentOffsets.current.g.x}px, ${currentOffsets.current.g.y}px)`;
    }

    animationFrameId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, [loop]);

  const handleMouseEnter = useCallback(() => {
    isHovered.current = true;
  }, []);

  const handleMouseLeave = useCallback(() => {
    isHovered.current = false;
    if (!configRef.current.trackWindowMouse) {
      targetMousePos.current = { x: 0, y: 0 };
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

      let nx = (e.clientX - centerX) / (rect.width / 2);
      let ny = (e.clientY - centerY) / (rect.height / 2);

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
