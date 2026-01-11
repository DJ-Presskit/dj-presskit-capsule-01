"use client";
import React from "react";
import { twMerge } from "tailwind-merge";
import SVG, { Props } from "react-inlinesvg";

export interface IconProps extends Props {
  src: string;
  className?: string;
}

const Icon: React.FC<IconProps> = ({ src, className, height, width, fill, ...props }) => {
  return (
    <SVG
      width={width}
      height={height}
      src={src}
      color={fill}
      preProcessor={(code) => {
        return code
          .replace(/fill=".*?"/g, 'fill="currentColor"')
          .replace(/stroke=".*?"/g, 'stroke="currentColor"');
      }}
      className={twMerge(className, "transition duration-500 hover:cursor-pointer")}
      {...props}
    />
  );
};

export default Icon;
