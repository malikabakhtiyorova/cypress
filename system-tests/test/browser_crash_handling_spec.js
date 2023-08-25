const systemTests = require('../lib/system-tests').default

describe('Browser Crash Handling', () => {
  systemTests.setup({
    settings: {
      e2e: {},
    },
  })

  // It should fail the chrome_tab_crash spec, but the simple spec should run and succeed
  context('when the tab crashes in chrome', () => {
    systemTests.it('fails', {
      browser: 'chrome',
      spec: 'chrome_tab_crash.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
    })
  })

  // It should fail the chrome_tab_crash spec, but the simple spec should run and succeed
  context('when the tab crashes in electron', () => {
    systemTests.it('fails', {
      browser: 'electron',
      spec: 'chrome_tab_crash.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
    })
  })

  // It should fail the chrome_tab_close spec, but the simple spec should run and succeed
  context('when the tab closes in chrome', () => {
    systemTests.it('fails', {
      browser: 'chrome',
      spec: 'chrome_tab_close.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
    })
  })

  // Because electron does not have any concepts with regard to a "page" aka a tab
  // ...when the tab itself closes, the whole browser process is also closed
  // so we actually want the same behavior as the "browser process is killed"
  // and not to recover or continue, we should exit early
  context('when the tab closes in electron', () => {
    systemTests.it('fails', {
      browser: 'electron',
      spec: 'chrome_tab_close.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
    })
  })

  // It should fail the chrome_process_kill spec, but the simple spec should run and succeed
  // NOTE: we do NOT test the "browser process" being killed in electron because
  // there is no valid situation to simulate this. the main browser process is actually
  // not the renderer process but the actual electron process, and killing it would be
  // killing the entire cypress process, which is unrecoverable. this is also the same
  // thing as hitting "CMD+C" in the terminal to kill the cypress process, so its not
  // a situation we have to test for.
  context('when the browser process is killed in chrome', () => {
    systemTests.it('fails', {
      browser: 'chrome',
      spec: 'chrome_process_kill.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
    })
  })

  // It should fail the chrome_tab_crash spec, but the simple spec should run and succeed
  context('when the browser process crashes in chrome', () => {
    systemTests.it('fails w/ video off', {
      browser: 'chrome',
      spec: 'chrome_process_crash.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
      config: {
        video: false,
      },
      onStdout: (stdout) => {
        // the location of this warning is non-deterministic
        return stdout.replace('The automation client disconnected. Cannot continue running tests.\n', '')
      },
    })

    systemTests.it('fails w/ video on', {
      browser: 'chrome',
      spec: 'chrome_process_crash.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
      config: {
        video: true,
      },
      onStdout: (stdout) => {
        // the location of this warning is non-deterministic
        return stdout.replace('The automation client disconnected. Cannot continue running tests.\n', '')
      },
    })
  })

  // If chrome crashes, all of cypress crashes when in electron
  context('when the browser process crashes in electron', () => {
    systemTests.it('fails', {
      browser: 'electron',
      spec: 'chrome_process_crash.cy.js,simple.cy.js',
      snapshot: true,
      expectedExitCode: 1,
    })
  })

  context('when the window closes mid launch of the browser process', () => {
    systemTests.it('passes', {
      browser: 'electron',
      spec: 'abort_beforeunload_event_child.cy.ts,abort_beforeunload_event.cy.ts',
      snapshot: true,
      expectedExitCode: 0,
      config: {
        video: false,
      },
    })
  })
})
