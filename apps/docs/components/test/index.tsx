import { useState } from 'react';
import { ReactFreehand } from 'react-freehand';
// import {
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Bar,
// } from 'recharts';
import { Camera } from 'react-feather';
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

export const Test = () => {
  const [seed, setSeed] = useState(1);
  const onClick = () => {
    setSeed(seed + 1);
  };
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
      <button onClick={onClick}>change</button>
      <ReactFreehand>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <line x1={0} y1={0} x2={24} y2={24}></line>
        </svg> */}
        <Camera />
      </ReactFreehand>
      <Camera />
    </div>
  );
};
