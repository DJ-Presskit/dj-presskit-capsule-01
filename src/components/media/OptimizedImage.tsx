"use client";

import React, { useState, useCallback, useMemo } from "react";
import Image, { ImageProps } from "next/image";
import { twMerge } from "tailwind-merge";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Variantes de aspecto de imagen predefinidas para consistencia en el sistema de diseño.
 * Permiten generar automáticamente los valores correctos de width/height.
 */
export type AspectRatioPreset =
  | "1:1" // Cuadrado (avatars, thumbnails)
  | "4:3" // Clásico horizontal
  | "3:4" // Clásico vertical (portraits)
  | "16:9" // Widescreen (heroes, banners)
  | "9:16" // Vertical (mobile, stories)
  | "21:9" // Ultra-wide (cinematic)
  | "2:3" // Posters
  | "3:2"; // Landscape photography

/**
 * Estrategias de carga para diferentes casos de uso.
 */
export type LoadingStrategy =
  | "eager" // Above the fold, crítico para LCP
  | "lazy" // Below the fold, cargar cuando sea visible
  | "priority"; // Hero images, máxima prioridad

/**
 * Presets de tamaños responsivos optimizados para CDN.
 * Cada preset genera automáticamente el atributo `sizes` correcto.
 */
export type SizesPreset =
  | "full" // 100vw - Ocupa todo el ancho
  | "half" // 50vw en desktop, 100vw en mobile
  | "third" // 33vw en desktop, 100vw en mobile
  | "quarter" // 25vw en desktop, 50vw en mobile
  | "thumbnail" // Tamaños pequeños fijos
  | "hero" // Hero optimizado
  | "gallery" // Grid de galería
  | "card"; // Tarjetas de contenido

/**
 * Props del componente OptimizedImage.
 * Extiende ImageProps de Next.js con optimizaciones adicionales.
 */
export interface OptimizedImageProps extends Omit<
  ImageProps,
  "loading" | "fetchPriority" | "onError" | "onLoad"
> {
  /**
   * URL de la imagen. Soporta URLs de CDN (Cloudflare Images, etc.)
   * @required
   */
  src: string;

  /**
   * Texto alternativo para accesibilidad. Siempre requerido.
   * @required
   */
  alt: string;

  /**
   * Preset de aspect ratio para calcular automáticamente dimensiones.
   * Si se proporciona, width/height se ignoran.
   */
  aspectRatio?: AspectRatioPreset;

  /**
   * Ancho base para calcular height con aspectRatio.
   * @default 1920
   */
  baseWidth?: number;

  /**
   * Preset de tamaños responsivos.
   * Genera automáticamente el atributo `sizes` optimizado.
   */
  sizesPreset?: SizesPreset;

  /**
   * Valor personalizado de sizes si los presets no son suficientes.
   * Tiene prioridad sobre sizesPreset.
   */
  sizes?: string;

  /**
   * Estrategia de carga optimizada.
   * - "eager": Carga inmediata (LCP, above the fold)
   * - "lazy": Lazy loading nativo (below the fold)
   * - "priority": Máxima prioridad con preload
   * @default "lazy"
   */
  loadingStrategy?: LoadingStrategy;

  /**
   * Clases CSS adicionales para el contenedor.
   */
  containerClassName?: string;

  /**
   * Clases CSS adicionales para la imagen.
   */
  className?: string;

  /**
   * Mostrar efecto de blur placeholder mientras carga.
   * @default true
   */
  showBlurPlaceholder?: boolean;

  /**
   * Color del placeholder blur (CSS color).
   * @default "rgba(0,0,0,0.1)"
   */
  placeholderColor?: string;

  /**
   * Imagen fallback si la principal falla.
   * Útil para casos donde el CDN no responde.
   */
  fallbackSrc?: string;

  /**
   * Callback cuando la imagen carga exitosamente.
   */
  onLoadComplete?: () => void;

  /**
   * Callback cuando la imagen falla al cargar.
   */
  onLoadError?: (error: Error) => void;

  /**
   * Desactivar completamente las optimizaciones de Next.js Image.
   * Útil para SVGs o imágenes ya optimizadas.
   * @default false
   */
  unoptimized?: boolean;

  /**
   * Calidad de la imagen (1-100).
   * Solo aplica para formatos que soporten compresión.
   * @default 85
   */
  quality?: number;

  /**
   * Modo de ajuste de la imagen dentro del contenedor.
   */
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";

  /**
   * Posición del objeto dentro del contenedor.
   */
  objectPosition?: string;

  /**
   * Forzar uso de fill mode (imagen llena todo el contenedor).
   * Requiere que el padre tenga position: relative.
   */
  fill?: boolean;
}

// =============================================================================
// CONSTANTS & UTILITIES
// =============================================================================

/**
 * Mapeo de aspect ratios a valores numéricos (width/height).
 */
const ASPECT_RATIO_MAP: Record<AspectRatioPreset, number> = {
  "1:1": 1,
  "4:3": 4 / 3,
  "3:4": 3 / 4,
  "16:9": 16 / 9,
  "9:16": 9 / 16,
  "21:9": 21 / 9,
  "2:3": 2 / 3,
  "3:2": 3 / 2,
};

/**
 * Presets de sizes para diferentes layouts.
 * Optimizados para CDN y diferentes viewports.
 */
const SIZES_PRESETS: Record<SizesPreset, string> = {
  full: "100vw",
  half: "(min-width: 768px) 50vw, 100vw",
  third: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  quarter: "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  thumbnail: "(min-width: 768px) 96px, 64px",
  hero: "(min-width: 1920px) 1920px, 100vw",
  gallery: "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  card: "(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw",
};

/**
 * Calcula las dimensiones de la imagen basándose en el aspect ratio.
 */
function calculateDimensions(
  aspectRatio: AspectRatioPreset,
  baseWidth: number,
): { width: number; height: number } {
  const ratio = ASPECT_RATIO_MAP[aspectRatio];
  return {
    width: baseWidth,
    height: Math.round(baseWidth / ratio),
  };
}

/**
 * Genera un data URL de placeholder blur para transiciones suaves.
 */
function generateBlurPlaceholder(color: string): string {
  // SVG minimalista para placeholder blur
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect fill="${color}" width="4" height="3"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Valida si una URL es de un CDN soportado.
 */
function isCdnUrl(src: string): boolean {
  const cdnPatterns = [
    /imagedelivery\.net/i, // Cloudflare Images
    /cloudflare-ipfs\.com/i, // Cloudflare IPFS
    /dj-presskit\.com/i, // Custom CDN
    /sndcdn\.com/i, // SoundCloud CDN
  ];
  return cdnPatterns.some((pattern) => pattern.test(src));
}

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Componente de imagen optimizado para el sistema multi-tenant.
 *
 * @description
 * Componente CORE para renderizar imágenes con máximas optimizaciones:
 * - Lazy loading nativo con estrategias configurables
 * - Presets de aspect ratio para consistencia en diseño
 * - Sizes responsivos optimizados para CDN
 * - Blur placeholder para mejor UX durante carga
 * - Fallback automático si la imagen falla
 * - Aceleración por hardware para transiciones
 * - Memoización de props para evitar re-renders
 *
 * @example
 * // Hero image con máxima prioridad
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero banner"
 *   loadingStrategy="priority"
 *   sizesPreset="hero"
 *   aspectRatio="16:9"
 *   fill
 * />
 *
 * @example
 * // Thumbnail en grid
 * <OptimizedImage
 *   src="/thumb.jpg"
 *   alt="Gallery item"
 *   loadingStrategy="lazy"
 *   sizesPreset="gallery"
 *   aspectRatio="1:1"
 *   width={256}
 *   height={256}
 * />
 *
 * @example
 * // Imagen con dimensiones personalizadas
 * <OptimizedImage
 *   src="/custom.jpg"
 *   alt="Custom image"
 *   width={800}
 *   height={600}
 *   sizes="(min-width: 768px) 800px, 100vw"
 *   quality={90}
 * />
 */
const OptimizedImage: React.FC<OptimizedImageProps> = React.memo(
  ({
    src,
    alt,
    aspectRatio,
    baseWidth = 1920,
    sizesPreset,
    sizes: customSizes,
    loadingStrategy = "lazy",
    containerClassName,
    className,
    showBlurPlaceholder = true,
    placeholderColor = "rgba(0,0,0,0.1)",
    fallbackSrc,
    onLoadComplete,
    onLoadError,
    unoptimized = false,
    quality = 85,
    objectFit = "cover",
    objectPosition = "center",
    fill,
    width: propWidth,
    height: propHeight,
    ...restProps
  }) => {
    // =========================================================================
    // STATE
    // =========================================================================
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // =========================================================================
    // MEMOIZED VALUES
    // =========================================================================

    /**
     * Calcula dimensiones basadas en aspect ratio o props directos.
     */
    const dimensions = useMemo(() => {
      if (fill) return undefined;
      if (aspectRatio) {
        return calculateDimensions(aspectRatio, baseWidth);
      }
      if (propWidth && propHeight) {
        return { width: Number(propWidth), height: Number(propHeight) };
      }
      return undefined;
    }, [aspectRatio, baseWidth, fill, propWidth, propHeight]);

    /**
     * Determina el valor de sizes para srcset.
     */
    const computedSizes = useMemo(() => {
      if (customSizes) return customSizes;
      if (sizesPreset) return SIZES_PRESETS[sizesPreset];
      return "100vw";
    }, [customSizes, sizesPreset]);

    /**
     * Genera el placeholder blur si está habilitado.
     */
    const blurDataURL = useMemo(() => {
      if (!showBlurPlaceholder) return undefined;
      return generateBlurPlaceholder(placeholderColor);
    }, [showBlurPlaceholder, placeholderColor]);

    /**
     * Determina propiedades de carga basadas en la estrategia.
     */
    const loadingProps = useMemo(() => {
      switch (loadingStrategy) {
        case "priority":
          return {
            priority: true,
            loading: "eager" as const,
            fetchPriority: "high" as const,
          };
        case "eager":
          return {
            priority: false,
            loading: "eager" as const,
            fetchPriority: "high" as const,
          };
        case "lazy":
        default:
          return {
            priority: false,
            loading: "lazy" as const,
            fetchPriority: "auto" as const,
          };
      }
    }, [loadingStrategy]);

    /**
     * Clases memoizadas para el contenedor.
     */
    const containerClasses = useMemo(
      () => twMerge("relative overflow-hidden", fill ? "w-full h-full" : "", containerClassName),
      [containerClassName, fill],
    );

    /**
     * Clases memoizadas para la imagen con transiciones.
     */
    const imageClasses = useMemo(
      () =>
        twMerge(
          // Transición suave al cargar
          "transition-opacity duration-300 ease-out",
          // Para eager/priority: empezar visible para evitar flash
          // Para lazy: fade-in desde 0 cuando carga
          loadingStrategy === "lazy" ? (isLoaded ? "opacity-100" : "opacity-0") : "opacity-100",
          // Clase personalizada del usuario
          className,
        ),
      [className, isLoaded, loadingStrategy],
    );

    /**
     * Estilos inline optimizados para GPU.
     */
    const imageStyles = useMemo(
      () => ({
        objectFit,
        objectPosition,
        // Forzar aceleración por hardware solo si es necesario
        ...(loadingStrategy === "priority" && {
          willChange: "opacity",
          transform: "translateZ(0)",
        }),
      }),
      [objectFit, objectPosition, loadingStrategy],
    );

    /**
     * URL de imagen actual (original o fallback).
     */
    const currentSrc = useMemo(() => {
      if (hasError && fallbackSrc) return fallbackSrc;
      return src;
    }, [hasError, fallbackSrc, src]);

    /**
     * Determina si la imagen debe ser optimizada por Next.js.
     * Cloudflare Images y CDNs conocidos ya entregan variantes optimizadas en edge,
     * y en multi-tenant evitamos depender de /_next/image.
     */
    const shouldOptimize = useMemo(() => {
      if (unoptimized) return false;

      // SVGs no necesitan optimización
      if (currentSrc.toLowerCase().endsWith(".svg")) return false;

      // ✅ Cloudflare Images (y otros CDNs que vos definas) -> NO pasar por /_next/image
      // Esto evita que el Router tenga que soportar image optimizer.
      if (isCdnUrl(currentSrc)) return false;

      return true;
    }, [unoptimized, currentSrc]);

    // =========================================================================
    // CALLBACKS
    // =========================================================================

    /**
     * Handler para carga exitosa de imagen.
     */
    const handleLoad = useCallback(() => {
      setIsLoaded(true);
      onLoadComplete?.();
    }, [onLoadComplete]);

    /**
     * Handler para error de carga.
     */
    const handleError = useCallback(() => {
      if (!hasError) {
        setHasError(true);
        onLoadError?.(new Error(`Failed to load image: ${src}`));
      }
    }, [hasError, onLoadError, src]);

    // =========================================================================
    // RENDER
    // =========================================================================

    return (
      <div className={containerClasses}>
        <Image
          {...restProps}
          src={currentSrc}
          alt={alt}
          {...(fill ? { fill: true } : dimensions)}
          sizes={computedSizes}
          quality={quality}
          unoptimized={!shouldOptimize}
          placeholder={blurDataURL ? "blur" : "empty"}
          blurDataURL={blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          className={imageClasses}
          style={imageStyles}
          {...loadingProps}
        />
      </div>
    );
  },
);

// Nombre para debugging en React DevTools
OptimizedImage.displayName = "OptimizedImage";

// =============================================================================
// EXPORTS
// =============================================================================

export default OptimizedImage;

// Re-exportar tipos útiles para consumidores
export type {
  AspectRatioPreset as ImageAspectRatio,
  LoadingStrategy as ImageLoadingStrategy,
  SizesPreset as ImageSizesPreset,
};
