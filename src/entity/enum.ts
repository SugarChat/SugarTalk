export enum MeetingStreamMode {
  MCU,
  SFU,
}

export enum StreamType {
  Video,
  ShareScreen,
}

export enum PaintTool {
  Cursor, // 光标
  Move, // 选择
  Laser, // 激光笔
  Brush, // 画笔
  Text, // 文本
  Graphical, // 图形
  Eraser, // 橡皮擦
  Undo, // 撤销
  Redo, // 重做
  Clear, // 清空
  Save, // 保存
}

export enum DataChannelCommand {
  Notify = "Notify",
}

export enum DataChannelNotifyType {
  EndMeeting = "EndMeeting",
}
