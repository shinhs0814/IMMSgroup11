/**
 * PlateFace — SVG plate mascot matching the Sunny prototype exactly.
 * Fixed viewBox "0 0 144 130" — plate peeks up from cy=92.
 * mood: 'happy' | 'wary' | 'sad'
 */
import React from 'react';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';

type Props = {
  size?: number;
  mood?: 'happy' | 'wary' | 'sad';
  plate?: string;
  rim?: string;
  pupil?: string;
  cheek?: string | null;
};

export default function PlateFace({
  size = 96,
  mood = 'happy',
  plate = '#FCEEE9',
  rim = '#F3D9D1',
  pupil = '#E0BCB2',
  cheek = null,
}: Props) {
  const eye = (cx: number) => {
    if (mood === 'happy') {
      return (
        <Path
          d={`M${cx - 7} 62 q7 -9 14 0`}
          stroke={pupil}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      );
    }
    return (
      <>
        <Ellipse cx={cx} cy={60} rx={7} ry={11} fill="#fff" />
        <Ellipse
          cx={cx}
          cy={mood === 'sad' ? 64 : 63}
          rx={5.5}
          ry={8}
          fill={pupil}
        />
      </>
    );
  };

  const mouthD =
    mood === 'happy'
      ? 'M60 80 q12 12 24 0'
      : mood === 'sad'
      ? 'M62 86 q10 -9 20 0'
      : 'M64 84 h16';

  return (
    <Svg width={size} height={size} viewBox="0 0 144 130">
      {/* Rim */}
      <Circle cx={72} cy={92} r={56} fill={rim} />
      {/* Plate */}
      <Circle cx={72} cy={92} r={47} fill={plate} />

      {/* Cheeks */}
      {cheek && (
        <>
          <Circle cx={50} cy={76} r={6} fill={cheek} opacity={0.6} />
          <Circle cx={94} cy={76} r={6} fill={cheek} opacity={0.6} />
        </>
      )}

      {/* Eyes */}
      {eye(57)}
      {eye(87)}

      {/* Mouth */}
      <Path
        d={mouthD}
        stroke={pupil}
        strokeWidth={4.5}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
