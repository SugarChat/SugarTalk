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
