"use client";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";

const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform float colorNum;
uniform float pixelSize;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 6;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p - fbm(p + fbm(p2)));
}

// Matriz de Bayer 4x4
const float bayerMatrix4x4[16] = float[16](
  0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
  12.0/16.0, 4.0/16.0, 14.0/16.0,  6.0/16.0,
  3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
  15.0/16.0, 7.0/16.0, 13.0/16.0,  5.0/16.0
);

vec3 applyDither(vec2 fragCoord, vec3 color) {
  vec2 scaledCoord = floor(fragCoord / max(pixelSize, 1.0));
  int x = int(mod(scaledCoord.x, 4.0));
  int y = int(mod(scaledCoord.y, 4.0));
  float threshold = bayerMatrix4x4[y * 4 + x] - 0.25;
  float steps = max(colorNum - 1.0, 1.0);
  color += threshold * (1.0 / steps);
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * steps + 0.5) / steps;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  vec3 col = mix(vec3(0.0), waveColor, f);
  col = applyDither(gl_FragCoord.xy, col);
  gl_FragColor = vec4(col, 1.0);
}
`;

interface WaveUniforms {
  [key: string]: THREE.Uniform<any>;
  time: THREE.Uniform<number>;
  resolution: THREE.Uniform<THREE.Vector2>;
  waveSpeed: THREE.Uniform<number>;
  waveFrequency: THREE.Uniform<number>;
  waveAmplitude: THREE.Uniform<number>;
  waveColor: THREE.Uniform<THREE.Color>;
  colorNum: THREE.Uniform<number>;
  pixelSize: THREE.Uniform<number>;
}

interface DitheredWavesProps {
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  waveColor: [number, number, number];
  colorNum: number;
  pixelSize: number;
  disableAnimation: boolean;
}

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
}: DitheredWavesProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef<WaveUniforms>({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    colorNum: new THREE.Uniform(colorNum),
    pixelSize: new THREE.Uniform(pixelSize),
  });

  // Optimización: Solo actualizar resolución cuando realmente cambie
  const lastSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const newWidth = Math.floor(size.width * dpr);
    const newHeight = Math.floor(size.height * dpr);

    if (lastSizeRef.current.width !== newWidth || lastSizeRef.current.height !== newHeight) {
      waveUniformsRef.current.resolution.value.set(newWidth, newHeight);
      lastSizeRef.current = { width: newWidth, height: newHeight };
    }
  }, [size, gl]);

  // Optimización: Solo actualizar uniforms cuando los valores cambien
  const lastPropsRef = useRef({
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    waveColor,
    colorNum,
    pixelSize,
  });

  useFrame(({ clock }) => {
    if (!disableAnimation) {
      waveUniformsRef.current.time.value = clock.getElapsedTime();
    }

    // Solo actualizar si los props cambiaron
    const currentProps = {
      waveSpeed,
      waveFrequency,
      waveAmplitude,
      waveColor,
      colorNum,
      pixelSize,
    };
    const lastProps = lastPropsRef.current;

    if (lastProps.waveSpeed !== currentProps.waveSpeed) {
      waveUniformsRef.current.waveSpeed.value = waveSpeed;
    }
    if (lastProps.waveFrequency !== currentProps.waveFrequency) {
      waveUniformsRef.current.waveFrequency.value = waveFrequency;
    }
    if (lastProps.waveAmplitude !== currentProps.waveAmplitude) {
      waveUniformsRef.current.waveAmplitude.value = waveAmplitude;
    }
    if (lastProps.waveColor !== currentProps.waveColor) {
      waveUniformsRef.current.waveColor.value.set(...waveColor);
    }
    if (lastProps.colorNum !== currentProps.colorNum) {
      waveUniformsRef.current.colorNum.value = colorNum;
    }
    if (lastProps.pixelSize !== currentProps.pixelSize) {
      waveUniformsRef.current.pixelSize.value = pixelSize;
    }

    lastPropsRef.current = currentProps;
  });

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
        />
      </mesh>
    </>
  );
}

interface DitherProps {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number];
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  quality?: "high" | "medium" | "low";
}

// DPR scaling based on quality level
const QUALITY_DPR = {
  high: 0.6,
  medium: 0.4,
  low: 0.3,
} as const;

export default function Dither({
  waveSpeed = 0.25,
  waveFrequency = 0.3,
  waveAmplitude = 0.4,
  waveColor = [80 / 255, 18 / 255, 105 / 255],
  colorNum = 10,
  pixelSize = 2,
  disableAnimation = false,
  quality = "high",
}: DitherProps) {
  // Use quality-based DPR for performance scaling
  const dpr = QUALITY_DPR[quality];

  return (
    <Canvas
      className="w-full h-full relative"
      style={{ filter: "blur(1.5px)" }}
      camera={{ position: [0, 0, 6] }}
      dpr={dpr}
      gl={{
        antialias: false, // Deshabilitado para mejor performance
        preserveDrawingBuffer: false, // Deshabilitado si no es necesario
        powerPreference: "high-performance",
      }}
    >
      <DitheredWaves
        waveSpeed={waveSpeed}
        waveFrequency={waveFrequency}
        waveAmplitude={waveAmplitude}
        waveColor={waveColor}
        colorNum={colorNum}
        pixelSize={pixelSize}
        disableAnimation={disableAnimation}
      />
    </Canvas>
  );
}
