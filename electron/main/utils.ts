import { screen, Point } from "electron";

/**
 * 获取新打开窗口在当前屏幕的XY坐标
 * @param width window width
 * @param height window height
 */
export const getNewWindowPoint = (width: number, height: number): Point => {
  const { workArea } = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint()
  );
  return {
    x: Math.floor(workArea.x + (workArea.width - width) / 2),
    y: Math.floor(workArea.y + (workArea.height - height) / 2),
  };
};
