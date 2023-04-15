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
} from 'react-feather';
import { MoonIcon, HeartIcon, FlagIcon } from '@heroicons/react/24/solid';

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
  <RoughSVG
    className="flex gap-4 my-4"
    options={{ roughness: 0.5, seed: 2, bowing: 15 }}
  >
    <Battery size={36} />
    <Bell size={36} />
    <Coffee size={36} />
    <Image size={36} />
  </RoughSVG>
);

const AnimatedIconDemo = () => {
  const [seed, setSeed] = useState(0);
  useAnimationFrame((time) => {
    setSeed(Math.floor(time / 0.5));
  });
  return (
    <RoughSVG
      className="flex gap-4 my-4"
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
    </RoughSVG>
  );
};

const FillIconDemo = () => (
  <div className="flex gap-4 my-4">
    <div className="flex flex-col items-center">
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
      Moon
    </div>
    <div className="flex flex-col items-center">
      <RoughSVG
        options={{
          fillStyle: 'dashed',
          roughness: 0,
          dashOffset: 1,
          dashGap: 0.5,
          hachureGap: 1.75,
        }}
      >
        <HeartIcon style={{ width: '48px', height: '48px' }} color="#f5222d" />
      </RoughSVG>
      Heart
    </div>
    <div className="flex flex-col items-center">
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
      Flag
    </div>
  </div>
);

export const IconDemo = () => (
  <>
    <p>Basic</p>
    <BasicIconDemo />
    <p>Animated</p>
    <AnimatedIconDemo />
    <p>Fill</p>
    <FillIconDemo />
  </>
);
