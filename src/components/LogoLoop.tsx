import React, { useEffect, useMemo, useRef, useState } from 'react';
import './LogoLoop.css';

export type LogoItem =
  | {
      node: React.ReactNode;
      href?: string;
      title?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      href?: string;
      title?: string;
      srcSet?: string;
      sizes?: string;
      width?: number;
      height?: number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number; // pixels per second
  direction?: 'left' | 'right' | 'up' | 'down';
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  hoverSpeed?: number; // pixels per second when hovered
  fadeOut?: boolean;
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ANIMATION_TAU = 0.25; // smoothing constant

const toCssLength = (value?: number | string): string | undefined =>
  typeof value === 'number' ? `${value}px` : value ?? undefined;

const isImageItem = (item: LogoItem): item is Exclude<LogoItem, { node: React.ReactNode }> =>
  (item as any).src !== undefined;

const LogoLoop: React.FC<LogoLoopProps> = ({
  logos,
  speed = 100,
  direction = 'left',
  width,
  logoHeight = 40,
  gap = 24,
  pauseOnHover,
  hoverSpeed,
  fadeOut,
  fadeOutColor,
  scaleOnHover,
  renderItem,
  ariaLabel,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef<HTMLUListElement | null>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [seqHeight, setSeqHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const isVertical = direction === 'up' || direction === 'down';

  // Build repeated items for seamless loop
  const items = useMemo(() => logos, [logos]);

  // Measure sequence size
  const measure = () => {
    const el = seqRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSeqWidth(Math.max(1, Math.round(rect.width)));
    setSeqHeight(Math.max(1, Math.round(rect.height)));
  };

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    if (seqRef.current) ro.observe(seqRef.current);
    return () => ro.disconnect();
  }, [logos, gap, logoHeight, isVertical]);

  // Animation state
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const seqSize = isVertical ? seqHeight : seqWidth;
    if (seqSize <= 0) return;

    const animate = (ts: number) => {
      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
      }
      const dt = Math.max(0, ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const baseSpeed = speed * (direction === 'right' || direction === 'down' ? -1 : 1);
      const target = isHovered
        ? pauseOnHover
          ? 0
          : (hoverSpeed ?? baseSpeed)
        : baseSpeed;
      const k = 1 - Math.exp(-dt / ANIMATION_TAU);
      velocityRef.current += (target - velocityRef.current) * k;

      let nextOffset = offsetRef.current + velocityRef.current * dt;
      const size = seqSize;
      nextOffset = ((nextOffset % size) + size) % size; // wrap
      offsetRef.current = nextOffset;

      const transform = isVertical
        ? `translate3d(0, ${-nextOffset}px, 0)`
        : `translate3d(${-nextOffset}px, 0, 0)`;
      track.style.transform = transform;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [seqWidth, seqHeight, speed, direction, isVertical, isHovered, hoverSpeed, pauseOnHover]);

  const onEnter = () => setIsHovered(true);
  const onLeave = () => setIsHovered(false);

  const renderLogo = (item: LogoItem, key: React.Key) => {
    if (renderItem) return renderItem(item, key);
    const common = {
      className: `logo-loop__item ${scaleOnHover ? 'logo-loop__item--scale' : ''}`,
      style: { height: logoHeight }
    } as any;

    if (isImageItem(item)) {
      const img = (
        <img
          src={item.src}
          alt={item.alt || item.title || 'logo'}
          width={item.width}
          height={item.height || logoHeight}
          srcSet={item.srcSet}
          sizes={item.sizes}
          style={{ height: logoHeight }}
        />
      );
      return item.href ? (
        <a key={key} href={item.href} aria-label={item.title || item.alt} {...common}>
          {img}
        </a>
      ) : (
        <div key={key} {...common}>{img}</div>
      );
    }

    const node = <span style={{ fontSize: logoHeight * 0.8, lineHeight: `${logoHeight}px` }}>{item.node}</span>;
    return item.href ? (
      <a key={key} href={item.href} aria-label={item.title || item.ariaLabel} {...common}>
        {node}
      </a>
    ) : (
      <div key={key} {...common}>{node}</div>
    );
  };

  const copies = 3; // minimal copies for seamless loop

  return (
    <div
      ref={containerRef}
      className={`logo-loop ${className ?? ''}`}
      style={{ width: toCssLength(width), '--logo-height': `${logoHeight}px`, '--logo-gap': `${gap}px` } as React.CSSProperties}
      aria-label={ariaLabel}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={`logo-loop__viewport`}>
        <div ref={trackRef} className={`logo-loop__track ${isVertical ? 'logo-loop__track--vertical' : ''}`}>
          {Array.from({ length: copies }).map((_, i) => (
            <ul
              key={i}
              ref={i === 0 ? seqRef : undefined}
              className={`logo-loop__seq ${isVertical ? 'logo-loop__seq--vertical' : ''}`}
            >
              {items.map((item, idx) => (
                <li key={`${i}-${idx}`}>{renderLogo(item, `${i}-${idx}`)}</li>
              ))}
            </ul>
          ))}
        </div>
        {fadeOut && (
          <div
            className={`logo-loop__fade ${isVertical ? 'logo-loop__fade--vertical' : 'logo-loop__fade--horizontal'}`}
            style={{ ['--fade-color' as any]: fadeOutColor ?? 'transparent' }}
          />
        )}
      </div>
    </div>
  );
};

export default LogoLoop;