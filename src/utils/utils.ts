/**
 * 获取环境
 * @returns Promise<"mac" | "win" | "other">
 */
export const getPlatform = async () => {
  const platform = await window.electronAPI.platform();
  if (platform === "darwin") {
    return "mac";
  }
  if (platform.startsWith("win")) {
    return "win";
  }
  return "other";
};

export const GUID = (): string => {
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`
    .replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .toUpperCase();
};
