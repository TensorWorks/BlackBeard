# BlackBeard

Is a automated chromium that serves a local webpage that connect to the SPS websocket, starts the stream, and waits for a frame.

## Structure

`/Puppeteer` - The automated chromium using NodeJS

`/Client` - The local webpage that use Pixel Streaming frontend library to connect to SPS

`/Results` - The directory where the screenshot is saved

`/UE/Blackbeard` - The most minimal Pixel Streaming project possible (not currently used)
