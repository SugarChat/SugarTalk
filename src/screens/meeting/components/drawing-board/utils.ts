import { Point } from "../../../../entity/types";

export const pointsToSvgPath = (points: Point[]) => {
  let path = "";
  const startPoint = points[0];

  // 移动到起点
  path += "M " + startPoint.x + " " + startPoint.y + " ";

  // 遍历每个点，创建路径指令
  for (let i = 1; i < points.length; i++) {
    let point = points[i];
    path += "L " + point.x + " " + point.y + " ";
  }

  return path;
};
