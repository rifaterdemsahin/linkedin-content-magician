## Build Error: Unexpected closing Nav.LInk tag

**Date:** 2025-10-25

**Error Log:**

```
Deploy static content to Pages
docs: add build status badge to index.html footer #50
Jobs
Run details
Annotations
1 error
deploy
failed 3 minutes ago in 21s
Search logs
3s
1s
6s
7s
1s
Run cd 5_Symbols

&gt; linkedin-content-magician@1.0.0 build
&gt; vite build

vite v7.1.12 building for production...
transforming...
✓ 3 modules transformed.
✗ Build failed in 273ms
error during build:
[vite:esbuild] Transform failed with 3 errors:
/home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/src/App.jsx:372:24: ERROR: Unexpected closing "Nav.LInk" tag does not match opening "Nav.Link" tag
/home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/src/App.jsx:381:24: ERROR: Unexpected closing "Nav.LInk" tag does not match opening "Nav.Link" tag
/home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/src/App.jsx:390:24: ERROR: Unexpected closing "Nav.LInk" tag does not match opening "Nav.Link" tag
file: /home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/src/App.jsx:372:24

Unexpected closing "Nav.LInk" tag does not match opening "Nav.Link" tag
370 |                        &gt;
371 |                          Generate
372 |                        &lt;/Nav.LInk&gt;
    |                          ^
373 |                      &lt;/Nav.Item&gt;
374 |                      &lt;Nav.Item className="flex-fill"&gt;

Unexpected closing "Nav.LInk" tag does not match opening "Nav.Link" tag
379 |                        &gt;
380 |                          Review
381 |                        &lt;/Nav.LInk&gt;
    |                          ^
382 |                      &lt;/Nav.Item&gt;
383 |                      &lt;Nav.Item className="flex-fill"&gt;

Unexpected closing "Nav.LInk" tag does not match opening "Nav.Link" tag
388 |                        &gt;
389 |                          Setup
390 |                        &lt;/Nav.LInk&gt;
    |                          ^
391 |                      &lt;/Nav.Item&gt;
392 |                    &lt;/Nav&gt;

    at failureErrorWithLog (/home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/node_modules/esbuild/lib/main.js:1467:15)
    at /home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/node_modules/esbuild/lib/main.js:736:50
    at responseCallbacks.&lt;computed&gt; (/home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/node_modules/esbuild/lib/main.js:603:9)
    at handleIncomingPacket (/home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/node_modules/esbuild/lib/main.js:658:12)
    at Socket.readFromStdout (/home/runner/work/linkedin-content-magician/linkedin-content-magician/5_Symbols/node_modules/esbuild/lib/main.js:581:7)
    at Socket.emit (node:events:524:28)
    at addChunk (node:internal/streams/readable:561:12)
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
    at Readable.push (node:internal/streams/readable:392:5)
    at Pipe.onStreamRead (node:internal/stream_base_commons:191:23)
Error: Process completed with exit code 1.
```

**Root Cause:**

A typo was introduced in `5_Symbols/src/App.jsx`, where the closing tag for `Nav.Link` was incorrectly written as `</Nav.LInk>` in three places.

**Solution:**

Correct the typo by replacing all instances of `</Nav.LInk>` with `</Nav.Link>` in `5_Symbols/src/App.jsx`.
