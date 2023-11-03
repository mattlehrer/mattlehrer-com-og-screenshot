import puppeteer from '@cloudflare/puppeteer';

export interface Env {
	BROWSER: Fetcher;
}

const WIDTH = 1200;
const HEIGHT = 630;

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		console.log('got request', request.url);
		const { searchParams } = new URL(request.url);
		let url = searchParams.get('url');
		if (url) {
			console.log({ url });
			url = new URL(url).toString(); // normalize
			const browser = await puppeteer.launch(env.BROWSER);
			const page = await browser.newPage();
			await page.setViewport({ width: WIDTH + 20, height: HEIGHT + 20 });
			await page.goto(url);
			const img: Buffer = (await page.screenshot({
				captureBeyondViewport: false,
				clip: {
					width: WIDTH,
					height: HEIGHT,
					x: 0,
					y: 0,
				},
			})) as Buffer;
			console.log({ img });
			await browser.close();
			return new Response(img, {
				headers: {
					'content-type': 'image/png',
				},
			});
		} else {
			return new Response('Please add an ?url=https://example.com/ parameter');
		}
	},
};
