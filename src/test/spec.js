const test = require('ava');
const { Application } = require('spectron');
const path = require('path');
const electron = require('electron');

test.before(async t => {
  t.context.app = new Application({
		path: electron,
		args: [path.join(__dirname, '../../dist/main/main.js')]
  });
  
	await t.context.app.start();
});

test.after.always(async t => {
	await t.context.app.stop();
});

test.serial('Application launches correctly', async t => {
  const app = t.context.app;
  await app.client.waitUntilWindowLoaded();

  const win = app.browserWindow;
  t.is(await app.client.getWindowCount(), 1);
  t.false(await win.isMinimized());
  t.false(await win.isDevToolsOpened());
  t.true(await win.isVisible());
  t.true(await win.isFocused());

  const {width, height} = await win.getBounds();
	t.true(height === 400);
	t.true(width === 800);
});

test.serial('asdf starts the game', async t => {
	const app = t.context.app;
  await app.client.waitUntilWindowLoaded();

	t.truthy(await app.webContents.executeJavaScript("document.querySelector('canvas') !== undefined"));
});
