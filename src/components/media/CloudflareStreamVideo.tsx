"use client";

import React, { useEffect, useRef, useState } from "react";

interface CloudflareStreamVideoProps {
    uid: string;
    subdomain?: string;
    posterUrl?: string;
    mode?: "background" | "player";
    allowAudio?: boolean;
    className?: string;
    objectFit?: "cover" | "contain";
}

/**
 * CloudflareStreamVideo
 * 
 * Optimized component for playing Cloudflare Stream videos using HLS.js
 * Supports lazy loading via IntersectionObserver and dynamic HLS.js loading.
 */
export default function CloudflareStreamVideo({
    uid,
    subdomain = process.env.NEXT_PUBLIC_CF_STREAM_SUBDOMAIN || "customer-l7ljfalzdvvkz8pd.cloudflarestream.com",
    posterUrl,
    mode = "background",
    allowAudio = false,
    className = "",
    objectFit = "cover",
}: CloudflareStreamVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(false);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const manifestUrl = `https://${subdomain}/${uid}/manifest/video.m3u8`;
    const iframeUrl = `https://iframe.videodelivery.net/${uid}`;

    // Step 1: Intersection Observer for lazy loading
    useEffect(() => {
        if (typeof window === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Step 2: HLS logic
    useEffect(() => {
        if (!isIntersecting || !videoRef.current || !uid || typeof window === "undefined") return;

        const video = videoRef.current;
        let hls: any = null;

        const initHls = async () => {
            // Safari/iOS Native HLS
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = manifestUrl;
                video.onloadedmetadata = () => {
                    setIsReady(true);
                    if (mode === "background") video.play().catch(() => { });
                };
            } else {
                // Dynamic import hls.js to keep bundle small
                try {
                    const { default: Hls } = await import("hls.js");

                    if (Hls.isSupported()) {
                        hls = new Hls({
                            capLevelToPlayerSize: true,
                            autoStartLoad: true,
                            // Improve initial quality estimation
                            abrEwmaDefaultEstimate: 5000000, // 5 Mbps start estimate
                            abrEwmaDefaultEstimateMax: 10000000, // 10 Mbps max estimate
                        });

                        hls.loadSource(manifestUrl);
                        hls.attachMedia(video);

                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                            setIsReady(true);
                            if (mode === "background") video.play().catch(() => { });
                        });

                        hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
                            if (data.fatal) {
                                console.error("HLS.js fatal error:", data);
                                setError(true);
                            }
                        });
                    } else {
                        setError(true);
                    }
                } catch (err) {
                    console.error("Failed to load hls.js", err);
                    setError(true);
                }
            }
        };

        initHls();

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [isIntersecting, uid, manifestUrl, mode]);

    // Global click to unmute helper (SUPERPROMPT: active on any click)
    useEffect(() => {
        if (mode === "background" && allowAudio && typeof window !== "undefined") {
            const handleGlobalClick = () => {
                if (videoRef.current && videoRef.current.muted) {
                    videoRef.current.muted = false;
                    // After unmuting, ensure it's playing
                    videoRef.current.play().catch(() => { });
                }
            };

            // We listen on window for any click
            window.addEventListener("click", handleGlobalClick, { once: true });
            window.addEventListener("touchstart", handleGlobalClick, { once: true });

            return () => {
                window.removeEventListener("click", handleGlobalClick);
                window.removeEventListener("touchstart", handleGlobalClick);
            };
        }
    }, [mode, allowAudio, uid]); // uid as dependency to reset on video change

    // If there's an error and we are in player mode, fallback to cloudflare iframe
    if (error && mode === "player") {
        return (
            <iframe
                src={iframeUrl}
                className={`w-full h-full aspect-video ${className}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
            />
        );
    }

    return (
        <div ref={containerRef} className={`relative overflow-hidden w-full h-full ${className}`}>
            <video
                ref={videoRef}
                poster={posterUrl}
                className={`w-full h-full transition-opacity duration-1000 ${isReady ? "opacity-100" : "opacity-0"}`}
                style={{ objectFit }}
                muted={mode === "background"}
                loop={mode === "background"}
                playsInline
                controls={mode === "player"}
                preload={mode === "background" ? "auto" : "metadata"}
            />
            {!isReady && !error && (
                <div className="absolute inset-0 bg-black/20 animate-pulse" />
            )}
        </div>
    );
}
