import { test, expect, Page } from '@playwright/test';
import { InboundVideoStats, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.4'
import * as path from 'path';

declare global {
    interface Window { pixelstreaming: PixelStreaming; }
}

function delay(time: number) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time)
  });
}

async function waitForVideo(page: Page) {
    await page.evaluate(()=> {
        return new Promise((resolve, reject) => {
			if(!window.pixelstreaming){
				return reject("PixelStreaming object not attached to global window.");
			}

            window.pixelstreaming.addEventListener('playStream', (event) => {
                return resolve(event);
            });
        });
    });
}

// just quickly test that the default stream is working
test('Test default stream.', async ({ page }, testinfo) => {

    // set a long timeout for slow resource spin up
    test.setTimeout(2 * 60 * 1000);

    await page.goto("");
	await page.locator("#connectButton").click();

    // wait until we get a stream
    await waitForVideo(page);

    // let the stream run for a small duration
    await delay(15000);

    // query the frontend for its calculated stats
    const videoStats: InboundVideoStats = await page.evaluate(()=> {

		return new Promise((resolve, reject) => {

			if(!window.pixelstreaming) {
				return reject("Pixel Streaming object not attached to global window.");
			}

			return resolve(window.pixelstreaming._webRtcController.peerConnectionController.aggregatedStats.inboundVideoStats);

		});
    });

    // take a screenshot for posterity
    const __dirname = path.dirname(__filename);
    const screenshot = await page.screenshot({
        path: path.join(__dirname, '..', 'StreamResult.png'),
        fullPage: false
    });
    testinfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
	testinfo.attach('stats', { body: JSON.stringify(videoStats), contentType: 'application/json' })

	console.log(videoStats);

    // pass the test if we recorded any frames
    expect(videoStats.framesReceived).toBeGreaterThan(0);
});