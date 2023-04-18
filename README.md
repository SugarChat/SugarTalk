# SugarTalk

Sugar Talk Meeting

## Quick Start

```sh
yarn dev
```

## Directory

```diff
  ├─┬ electron
  │ ├─┬ main
  │ │ ├── index.ts    entry of Electron-Main
  │ │ └── handle.ts
  │ └─┬ preload
  │   ├── index.ts    entry of Preload-Scripts
  │   └── expose.ts
  ├─┬ src
  │ └── main.ts       entry of Electron-Renderer
  ├── index.html
  ├── package.json
  └── vite.config.ts
```

## macOS 权限设置

build/entitlements.mac.plist

```json
// electron-builder.json5
{
  "mac": {
    "hardenedRuntime": true,
    "entitlements": "public/entitlements.mac.plist",
    "entitlementsInherit": "public/entitlements.mac.plist",
    "gatekeeperAssess": false,
    "extendInfo": {
      "NSMicrophoneUsageDescription": "SugarTalk将会在您使用发起会议、加入会议等功能时使用您的麦克风",
      "NSCameraUsageDescription": "SugarTalk将会在您使用发起会议、加入会议等功能时使用您的摄像头"
    }
  }
}
```

清除麦克风/摄像头权限/屏幕录制

tccutil reset Camera org.erb.SugarTalk

tccutil reset Microphone org.erb.SugarTalk

tccutil reset ScreenCapture org.erb.SugarTalk

打开系统偏好设置-隐私与安全性-麦克风/摄像头/屏幕录制

open x-apple.systempreferences:com.apple.preference.security\?Privacy_Microphone

open x-apple.systempreferences:com.apple.preference.security\?Privacy_Camera

open x-apple.systempreferences:com.apple.preference.security\?Privacy_ScreenCapture
