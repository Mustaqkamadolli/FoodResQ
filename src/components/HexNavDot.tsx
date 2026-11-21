import React from 'react';

interface HexNavDotProps {
  color?: string;
  size?: number;
  active?: boolean;
}

export const HexNavDot: React.FC<HexNavDotProps> = ({
  color = '#000000',
  size = 12,
  active = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? color : 'none'}
      stroke={color}
      strokeWidth={active ? '2' : '1.5'}
      className="inline-block transition-transform hover:scale-125 cursor-pointer"
    >
      <polygon points="12 2, 21 7, 21 17, 12 22, 3 17, 3 7" />
    </svg>
  );
};
