import React, { useId, useState, useEffect, useRef } from 'react';
import { RGBSplitImageProps, RGBEffect } from './types';
import { useEffectEngine } from './engine';

const RGBSplitImageInner = React.forwardRef<HTMLElement, RGBSplitImageProps<any, any, any, any>>((props, forwardedRef) => {
    const {
        src,
        alt,
        idleEffect = 'none',
        onHover = 'none',
        onClick = 'none',
        onMount,
        effectDuration = 1000,
        effectIntensity = 1.5,
        breatheSpeed = 1.0,
        splitDistance = 40,
        colorSpace = 'rgb',
        grayscale = false,
        trackWindowMouse = false,
        disableOnMobile = false,
        as: Component = 'img',
        style,
        className,
        onMouseEnter,
        onMouseLeave,
        onMouseMove,
        onImageClick,
        ...rest
    } = props;

    const filterId = useId();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const handleReduceMotion = (e: MediaQueryListEvent | MediaQueryList) => {
            setIsDisabled(e.matches || (disableOnMobile && window.innerWidth <= 768));
        };
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        handleReduceMotion(motionQuery);

        if (motionQuery.addEventListener) {
            motionQuery.addEventListener('change', handleReduceMotion);
        }

        const handleResize = () => handleReduceMotion(motionQuery);
        window.addEventListener('resize', handleResize);

        return () => {
            if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', handleReduceMotion);
            window.removeEventListener('resize', handleResize);
        };
    }, [disableOnMobile]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { rootMargin: '50px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const engine = useEffectEngine({
        idleEffect,
        onHover,
        onClick,
        onMount,
        effectDuration: effectDuration!,
        effectIntensity: effectIntensity!,
        breatheSpeed: breatheSpeed!,
        splitDistance,
        trackWindowMouse: trackWindowMouse!,
        disabled: isDisabled || !isVisible,
    });

    useEffect(() => {
        if (!trackWindowMouse) return;

        const handleWindowMouseMove = (e: MouseEvent) => {
            engine.handlers.onMouseMove(e, containerRef.current);
        };

        window.addEventListener('mousemove', handleWindowMouseMove);
        return () => window.removeEventListener('mousemove', handleWindowMouseMove);
    }, [trackWindowMouse, engine.handlers]);

    const handleMouseEnterWrapper = (e: React.MouseEvent<HTMLElement>) => {
        engine.handlers.onMouseEnter();
        onMouseEnter?.(e as any);
    };

    const handleMouseLeaveWrapper = (e: React.MouseEvent<HTMLElement>) => {
        engine.handlers.onMouseLeave();
        onMouseLeave?.(e as any);
    };

    const handleMouseMoveWrapper = (e: React.MouseEvent<HTMLElement>) => {
        engine.handlers.onMouseMove(e);
        onMouseMove?.(e as any);
    };

    const handleClickWrapper = (e: React.MouseEvent<HTMLElement>) => {
        engine.handlers.onClick();
        onImageClick?.(e);
    };

    const containerStyles: React.CSSProperties = {
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-block',
        width: '100%',
        height: '100%',
        ...style,
    };

    const baseImageStyles: React.CSSProperties = {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        willChange: (isDisabled || !isVisible) ? 'auto' : 'transform, filter',
    };

    const channelStyles: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        willChange: (isDisabled || !isVisible) ? 'auto' : 'transform, filter',
    };

    const applyFilters = (svgFilterId: string) => {
        const filters = [];
        if (grayscale) filters.push('grayscale(100%)');
        filters.push(`url(#${svgFilterId})`);
        return filters.join(' ');
    };

    let rMatrix, gMatrix, bMatrix;
    if (colorSpace === 'cmyk') {
        rMatrix = "0 0 0 0 0   0 1 0 0 0   0 0 1 0 0   0 0 0 1 0";
        gMatrix = "1 0 0 0 0   0 0 0 0 0   0 0 1 0 0   0 0 0 1 0";
        bMatrix = "1 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0";
    } else {
        rMatrix = "1 0 0 0 0   0 0 0 0 0   0 0 0 0 0   0 0 0 1 0";
        gMatrix = "0 0 0 0 0   0 1 0 0 0   0 0 0 0 0   0 0 0 1 0";
        bMatrix = "0 0 0 0 0   0 0 0 0 0   0 0 1 0 0   0 0 0 1 0";
    }

    return (
        <div
            className={className}
            style={containerStyles}
            onMouseEnter={handleMouseEnterWrapper}
            onMouseLeave={handleMouseLeaveWrapper}
            onMouseMove={handleMouseMoveWrapper}
            onClick={handleClickWrapper}
            ref={(node: HTMLDivElement | null) => {
                containerRef.current = node;
                if (typeof forwardedRef === 'function') {
                    forwardedRef(node);
                } else if (forwardedRef) {
                    forwardedRef.current = node;
                }
            }}
        >
            <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
                <defs>
                    <filter id={`${filterId}-r`} colorInterpolationFilters="sRGB">
                        <feColorMatrix type="matrix" values={rMatrix} />
                    </filter>
                    <filter id={`${filterId}-g`} colorInterpolationFilters="sRGB">
                        <feColorMatrix type="matrix" values={gMatrix} />
                    </filter>
                    <filter id={`${filterId}-b`} colorInterpolationFilters="sRGB">
                        <feColorMatrix type="matrix" values={bMatrix} />
                    </filter>
                </defs>
            </svg>

            <Component
                {...rest}
                src={src}
                alt={alt}
                style={{ ...baseImageStyles, filter: applyFilters(`${filterId}-b`) }}
            />

            <Component
                {...rest}
                src={src}
                alt=""
                aria-hidden="true"
                ref={engine.rChannelRef}
                style={{ ...channelStyles, filter: applyFilters(`${filterId}-r`) }}
            />

            <Component
                {...rest}
                src={src}
                alt=""
                aria-hidden="true"
                ref={engine.gChannelRef}
                style={{ ...channelStyles, filter: applyFilters(`${filterId}-g`) }}
            />
        </div>
    );
});

export const RGBSplitImage = RGBSplitImageInner as <
    I extends RGBEffect | undefined = undefined,
    H extends RGBEffect | undefined = undefined,
    C extends RGBEffect | undefined = undefined,
    M extends RGBEffect | undefined = undefined
>(
    props: RGBSplitImageProps<I, H, C, M> & { ref?: React.ForwardedRef<HTMLElement> }
) => React.ReactElement | null;

(RGBSplitImage as any).displayName = 'RGBSplitImage';
