import * as React from "react";
import Svg, { G, Rect, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */

function Login(props) {
  return (
    <Svg
      width={97}
      height={96}
      viewBox="0 0 97 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <G filter="url(#filter0_di_1072_814)">
        <Rect x={4} width={88.1837} height={88} rx={15} fill="#EF143B" />
        <Path
          d="M61.064 63.993H28.102V29.751L25.043 24h36.02L71.14 34.063v4.828l-5.041 5.072h4.959c.048 0 .082.034.082.081 0 10.185-.082 9.73-.082 9.73L61.064 64v-.007zm0-10.063v-6.267l-16.776-.237 5.418-7.7h11.44v-5.588H38.26v19.955h22.798v-.163h.007z"
          fill="#fff"
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
}

export default Login;
