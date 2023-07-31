export enum MeetingStreamMode {
  MCU,
  SFU,
}

export enum StreamType {
  Video,
  ShareScreen,
}

export enum DrawingTool {
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

// rtc的data channel 发送的命令
export enum DataChannelCommand {
  Notify = "notify", // 通知 例：主持人结束会议通知
  Drawing = "drawing", // 画板消息
  Message = "message", // IM消息
}

export enum DataChannelNotifyType {
  EndMeeting = "EndMeeting",
}

// 绘制过程
export enum DrawingStep {
  Start,
  Process,
  End,
}

// IM消息类型
export enum MessageType {
  Message,
}

// IM消息发送类型
export enum MessageSendStatus {
  Success,
  Sending,
  Fail,
}
