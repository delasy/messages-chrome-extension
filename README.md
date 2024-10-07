# messages-chrome-extension
Google Chrome extension built using React.js 18 and Vite 5.

The idea of this extension is to download messages from API, store them in storage
and display whenever popup opens.

## Quick Start

1. Install and build the project:

```shell
git clone https://github.com/delasy/messages-chrome-extension.git
cd messages-chrome-extension
npm install
npm run build
```

2. Go to `chrome://extensions` and toggle on "Developer mode".
3. Click "Load unpacked" and select `dist` folder created by `npm run build` command.

## Developing Locally
Start the build watch process with this command:

```shell
npm run dev
```

Whenever you do any code change it will recompile the project:

1. If you change popup code - you will see changes instantly
2. If you change service worker code - you will need to reload extension in `chrome://extensions`

## Project Structure
Code within this project follows clean architecture pattern.

1. `.github/workflows/` - CI workflows to test `build` step and `type-check` the project.
2. `assets/` - project assets, eg. media, fonts
3. `components/` - React.js components
4. `constants/` - constant variables/enums
5. `entities/` - objects that encapsulate business logic and represent the core concepts
6. `lib/` - utilities/helper functions
7. `popup/` - popup-related files
8. `store/` - entity methods used within popup/options
9. `tests/` - e2e tests
10. `use-cases/` - entity methods used within service worker
11. `background.ts` - entry point of service worker
12. `global.d.ts` - global typings

## Project Architecture

1. Service worker fetches new messages from API every 30 seconds using Google Chrome Alarms
2. Service worker stores fetched messages using Google Chrome Storage
3. No messages and loading states are handled properly
4. Any error that occurs is displayed within the extension for easier troubleshooting
5. State management is handled with help of TanStack Query
6. UI is styled using TailwindCSS

> NOTE: Right now all requests are mocked and have 1000ms delay in `lib/delay.ts`

> NOTE: Console logs added for easier troubleshooting of requests extension makes

## Future Improvements

1. Handling online/offline with help of `navigator.onLine` or handling fetch errors.
2. Handling fetch pagination and storing only latest messages in Google Chrome Storage.
3. Creating centralized place for handling communication between ServiceWorker <-> Popup
4. Reduce Google Chrome Storage data usage by compressing messages
