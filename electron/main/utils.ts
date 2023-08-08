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

interface WindowItem {
  readonly id: number;
  readonly path: string;
}

export class WindowManage {
  size: number = 0;

  record: Map<string, WindowItem> = new Map();

  parsePath(path: string) {
    const index = path.indexOf("?");
    return index === -1 ? path : path.slice(0, index);
  }

  get(path: string) {
    return this.record.get(this.parsePath(path));
  }

  set(item: WindowItem) {
    this.record.set(this.parsePath(item.path), item);
    this.size = this.record.size;
    return this;
  }

  delete(path: string) {
    const isSuccess = this.record.delete(this.parsePath(path));
    this.size = this.record.size;
    return isSuccess;
  }

  has(path: string) {
    return this.record.has(this.parsePath(path));
  }

  forEach(
    callbackfn: (
      value: WindowItem,
      key: string,
      map: Map<string, WindowItem>
    ) => void
  ) {
    this.record.forEach(callbackfn);
  }
}

export const windowManage = new WindowManage();
