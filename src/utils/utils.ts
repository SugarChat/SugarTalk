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
