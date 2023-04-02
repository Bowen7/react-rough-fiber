import { useEffect, useState } from 'react';
import { ReactFreehand } from 'react-freehand';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { Camera } from 'react-feather';
// @ts-ignore
import { imageToSVG } from 'imagetracerjs';
import SVG from 'react-inlinesvg';
import { Dog } from '../dog';
export const data = [
  {
    name: 'Page A',
    uv: 9000,
    pv: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
  },
];

const Content = () => {
  const [seed, setSeed] = useState(1);
  const onClick = () => {
    console.log(123);
    setSeed(seed + 1);
  };
  return (
    <button onClick={onClick} style={{ zIndex: seed }}>
      change
    </button>
  );
};

export const Test = () => {
  const [seed, setSeed] = useState(1);
  const [svg, setSVG] = useState('');
  const onClick = () => {
    console.log(123);
    setSeed(seed + 1);
  };
  // useEffect(() => {
  //   imageToSVG('/app.png', (str: string) => {
  //     setSVG(str);
  //   });
  // }, []);
  return (
    // <ReactFreehand>
    //   {/* <Camera size={36} /> */}
    //   <BarChart width={730} height={250} data={data}>
    //     <CartesianGrid strokeDasharray="3 3" />
    //     <XAxis dataKey="name" />
    //     <YAxis />
    //     <Tooltip />
    //     <Legend />
    //     <Bar dataKey="pv" fill="#8884d8" />
    //     <Bar dataKey="uv" fill="#82ca9d" />
    //   </BarChart>
    // </ReactFreehand>

    <div>
      <ReactFreehand>
        {/* {svg && <SVG src={svg} />} */}
        <button onClick={onClick} style={{ zIndex: seed }}>
          change
        </button>
        <BarChart width={730} height={250} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" fill="#8884d8" stroke="#333" />
          <Bar dataKey="uv" fill="#82ca9d" stroke="#333" />
        </BarChart>
        <Camera />
        {/* <Dog /> */}
      </ReactFreehand>
      <Camera />
    </div>
    // <>
    //   <button onClick={onClick}>change</button>
    //   <ReactFreehand
    //     shouldForceUpdateOnRoughOptionsChange
    //     roughOptions={{ seed }}
    //   >
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //     >
    //       <line x1={0} y1={0} x2={24} y2={24}></line>
    //     </svg>
    //   </ReactFreehand>
    // </>
  );
};
