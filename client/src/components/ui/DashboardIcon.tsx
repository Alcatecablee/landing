import Lottie from "lottie-react";
import { useRef, useState } from "react";

const dashboardAnimationData = {
  v: "5.9.6",
  fr: 60,
  ip: 0,
  op: 120,
  w: 750,
  h: 750,
  nm: "Comp 1",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Layer 2",
      sr: 1,
      ks: {
        o: {
          a: 0,
          k: 100,
          ix: 11,
        },
        r: {
          a: 0,
          k: 0,
          ix: 10,
        },
        p: {
          a: 0,
          k: [375, 375, 0],
          ix: 2,
          l: 2,
        },
        a: {
          a: 0,
          k: [489.5, 471.663, 0],
          ix: 1,
          l: 2,
        },
        s: {
          a: 0,
          k: [100, 100, 100],
          ix: 6,
          l: 2,
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "gr",
              it: [
                {
                  ind: 0,
                  ty: "sh",
                  ix: 1,
                  ks: {
                    a: 0,
                    k: {
                      i: [
                        [-64.471, 98.781],
                        [64.471, -98.781],
                      ],
                      o: [
                        [-64.471, 98.781],
                        [64.471, -98.781],
                      ],
                      v: [
                        [-64.471, 98.781],
                        [64.471, -98.781],
                      ],
                      c: false,
                    },
                    ix: 2,
                  },
                  nm: "Path 1",
                  mn: "ADBE Vector Shape - Group",
                  hd: false,
                  _render: true,
                },
                {
                  ty: "st",
                  c: {
                    a: 0,
                    k: [0.95, 0.95, 0.95, 1],
                    ix: 3,
                  },
                  o: {
                    a: 0,
                    k: 100,
                    ix: 4,
                  },
                  w: {
                    a: 0,
                    k: 35,
                    ix: 5,
                  },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 1",
                  mn: "ADBE Vector Graphic - Stroke",
                  hd: false,
                  _render: true,
                },
                {
                  ty: "tr",
                  p: {
                    a: 0,
                    k: [501.971, 450.663],
                    ix: 2,
                  },
                  a: {
                    a: 0,
                    k: [0, 0],
                    ix: 1,
                  },
                  s: {
                    a: 0,
                    k: [100, 100],
                    ix: 3,
                  },
                  r: {
                    a: 0,
                    k: 0,
                    ix: 6,
                  },
                  o: {
                    a: 0,
                    k: 100,
                    ix: 7,
                  },
                  sk: {
                    a: 0,
                    k: 0,
                    ix: 4,
                  },
                  sa: {
                    a: 0,
                    k: 0,
                    ix: 5,
                  },
                  nm: "Transform",
                  _render: true,
                },
              ],
              nm: "Group 1",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 1,
              mn: "ADBE Vector Group",
              hd: false,
              _render: true,
            },
            {
              ty: "gr",
              it: [
                {
                  ind: 0,
                  ty: "sh",
                  ix: 1,
                  ks: {
                    a: 0,
                    k: {
                      i: [
                        [23.894, 33.071],
                        [-12.575, 33.071],
                        [-33.071, 23.895],
                        [-33.071, -12.575],
                        [-23.895, -33.071],
                        [12.575, -33.071],
                        [33.071, -23.895],
                        [33.071, 12.575],
                      ],
                      o: [
                        [12.575, 33.071],
                        [-23.895, 33.071],
                        [-33.071, 12.575],
                        [-33.071, -23.895],
                        [-12.575, -33.071],
                        [23.894, -33.071],
                        [33.071, -12.575],
                        [33.071, 23.895],
                      ],
                      v: [
                        [12.575, 33.071],
                        [-12.575, 33.071],
                        [-33.071, 12.575],
                        [-33.071, -12.575],
                        [-12.575, -33.071],
                        [12.575, -33.071],
                        [33.071, -12.575],
                        [33.071, 12.575],
                      ],
                      c: true,
                    },
                    ix: 2,
                  },
                  nm: "Path 1",
                  mn: "ADBE Vector Shape - Group",
                  hd: false,
                  _render: true,
                },
                {
                  ty: "st",
                  c: {
                    a: 0,
                    k: [0.95, 0.95, 0.95, 1],
                    ix: 3,
                  },
                  o: {
                    a: 0,
                    k: 100,
                    ix: 4,
                  },
                  w: {
                    a: 0,
                    k: 35,
                    ix: 5,
                  },
                  lc: 2,
                  lj: 2,
                  bm: 0,
                  nm: "Stroke 1",
                  mn: "ADBE Vector Graphic - Stroke",
                  hd: false,
                  _render: true,
                },
                {
                  ty: "tr",
                  p: {
                    a: 0,
                    k: [490.065, 471.663],
                    ix: 2,
                  },
                  a: {
                    a: 0,
                    k: [0, 0],
                    ix: 1,
                  },
                  s: {
                    a: 0,
                    k: [100, 100],
                    ix: 3,
                  },
                  r: {
                    a: 0,
                    k: 0,
                    ix: 6,
                  },
                  o: {
                    a: 0,
                    k: 100,
                    ix: 7,
                  },
                  sk: {
                    a: 0,
                    k: 0,
                    ix: 4,
                  },
                  sa: {
                    a: 0,
                    k: 0,
                    ix: 5,
                  },
                  nm: "Transform",
                  _render: true,
                },
              ],
              nm: "Group 2",
              np: 2,
              cix: 2,
              bm: 0,
              ix: 2,
              mn: "ADBE Vector Group",
              hd: false,
              _render: true,
            },
            {
              ty: "tr",
              p: {
                a: 0,
                k: [491.971, 469.663],
                ix: 2,
              },
              a: {
                a: 0,
                k: [491.971, 469.663],
                ix: 1,
              },
              s: {
                a: 0,
                k: [100, 100],
                ix: 3,
              },
              r: {
                a: 1,
                k: [
                  {
                    i: {
                      x: [0.138],
                      y: [1],
                    },
                    o: {
                      x: [0.333],
                      y: [0],
                    },
                    t: 0,
                    s: [0],
                  },
                  {
                    i: {
                      x: [0],
                      y: [1.139],
                    },
                    o: {
                      x: [0.333],
                      y: [0],
                    },
                    t: 25,
                    s: [-101],
                  },
                  {
                    t: 50,
                    s: [0],
                  },
                ],
                ix: 6,
              },
              o: {
                a: 0,
                k: 100,
                ix: 7,
              },
              sk: {
                a: 0,
                k: 0,
                ix: 4,
              },
              sa: {
                a: 0,
                k: 0,
                ix: 5,
              },
              nm: "Transform",
              _render: true,
            },
          ],
          nm: "Group 4",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
          _render: true,
        },
        {
          ty: "gr",
          it: [
            {
              ind: 0,
              ty: "sh",
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: [
                    [-185.821, 205.476],
                    [-238, 126.221],
                    [-238, -26.251],
                    [-154.317, -213.163],
                    [51.088, -213.163],
                    [238, -129.48],
                    [238, 75.925],
                    [214.892, 179.019],
                  ],
                  o: [
                    [-218.13400000000001, 171.878],
                    [-238, 75.925],
                    [-238, -129.48],
                    [-51.088, -213.163],
                    [154.317, -213.163],
                    [238, -26.251],
                    [238, 130.17],
                    [177.983, 213.163],
                  ],
                  v: [
                    [-185.821, 205.476],
                    [-238, 75.925],
                    [-238, -26.251],
                    [-51.088, -213.163],
                    [51.088, -213.163],
                    [238, -26.251],
                    [238, 75.925],
                    [177.983, 213.163],
                  ],
                  c: false,
                },
                ix: 2,
              },
              nm: "Path 1",
              mn: "ADBE Vector Shape - Group",
              hd: false,
              _render: true,
            },
            {
              ty: "st",
              c: {
                a: 0,
                k: [0.95, 0.95, 0.95, 1],
                ix: 3,
              },
              o: {
                a: 0,
                k: 100,
                ix: 4,
              },
              w: {
                a: 0,
                k: 35,
                ix: 5,
              },
              lc: 2,
              lj: 2,
              bm: 0,
              nm: "Stroke 1",
              mn: "ADBE Vector Graphic - Stroke",
              hd: false,
              _render: true,
            },
            {
              ty: "tr",
              p: {
                a: 0,
                k: [489.5, 471.663],
                ix: 2,
              },
              a: {
                a: 0,
                k: [0, 0],
                ix: 1,
              },
              s: {
                a: 0,
                k: [100, 100],
                ix: 3,
              },
              r: {
                a: 0,
                k: 0,
                ix: 6,
              },
              o: {
                a: 0,
                k: 100,
                ix: 7,
              },
              sk: {
                a: 0,
                k: 0,
                ix: 4,
              },
              sa: {
                a: 0,
                k: 0,
                ix: 5,
              },
              nm: "Transform",
              _render: true,
            },
          ],
          nm: "Group 3",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 2,
          mn: "ADBE Vector Group",
          hd: false,
          _render: true,
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
      ct: 1,
      bm: 0,
      completed: true,
    },
  ],
  markers: [],
  __complete: true,
};

interface DashboardIconProps {
  className?: string;
}

export function DashboardIcon({ className = "w-6 h-6" }: DashboardIconProps) {
  const lottieRef = useRef<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    lottieRef.current?.pause();
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={dashboardAnimationData}
        loop={true}
        autoplay={false}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
