import { useState, useRef, useEffect } from 'react';
import { RoughSVG } from 'react-rough-fiber';
import {
  Bell,
  Battery,
  Coffee,
  Image,
  Youtube,
  Zap,
  Video,
  ChevronsDown,
} from 'react-feather';
import { MoonIcon, HeartIcon, FlagIcon } from '@heroicons/react/24/solid';
import { Comparison } from './comparison';

export const useAnimationFrame = (callback: (time: number) => void) => {
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const animate = () => {
    callback((performance.now() - startTimeRef.current) / 1000);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    startTimeRef.current = performance.now();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);
};

const BasicIconDemo = () => (
  <Comparison options={{ roughness: 0.5, seed: 2, bowing: 15 }}>
    <Battery size={36} />
    <Bell size={36} />
    <Coffee size={36} />
    <Image size={36} />
  </Comparison>
);

const AnimatedIconDemo = () => {
  const [seed, setSeed] = useState(0);
  useAnimationFrame((time) => {
    setSeed(Math.floor(time / 0.5));
  });
  return (
    <Comparison
      options={{
        roughness: 0.6,
        seed,
        disableMultiStroke: true,
      }}
    >
      <Youtube size={36} />
      <Zap size={36} />
      <Video size={36} />
      <Coffee size={36} />
    </Comparison>
  );
};

const FillIconDemo = () => (
  <div className="flex gap-4 my-4 flex-col items-center">
    <div className="flex gap-4">
      <MoonIcon style={{ width: '48px', height: '48px' }} color="#ffa940" />
      <HeartIcon style={{ width: '48px', height: '48px' }} color="#f5222d" />
      <FlagIcon
        style={{ width: '48px', height: '48px' }}
        stroke="none"
        fill="#ffa940"
      />
    </div>
    <ChevronsDown size={32} />
    <div className="flex gap-4">
      <RoughSVG
        options={{
          roughness: 0,
          dashOffset: 1,
          dashGap: 0.5,
          hachureGap: 2,
        }}
      >
        <MoonIcon style={{ width: '48px', height: '48px' }} color="#ffa940" />
      </RoughSVG>
      <RoughSVG
        options={{
          fillStyle: 'dashed',
          roughness: 0,
          dashOffset: 1,
          dashGap: 1,
          hachureGap: 1.75,
        }}
      >
        <HeartIcon style={{ width: '48px', height: '48px' }} color="#f5222d" />
      </RoughSVG>
      <RoughSVG
        options={{
          fillStyle: 'zigzag',
          roughness: 0,
          hachureGap: 1.5,
        }}
      >
        <FlagIcon
          style={{ width: '48px', height: '48px' }}
          stroke="none"
          fill="#ffa940"
        />
      </RoughSVG>
    </div>
  </div>
);

export const IconDemo = () => (
  <>
    <strong>Basic</strong>
    <BasicIconDemo />
    <strong>Animated</strong>
    <AnimatedIconDemo />
    <strong>Fill</strong>
    <FillIconDemo />
  </>
);
