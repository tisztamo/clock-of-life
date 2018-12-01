Clock of Life
=============

This is a wall clock implemented in <a href="http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">Conway's
Game of Life</a>. You can run it on a Raspberry Pi 3 or similar.

### The debugger

The clock speed is 23000 steps/min, so if you switch to manual mode to discover the
inner workings of the clockwork, you often have to wait a lot for the next signal glider to arrive.
It is possible to speed up the simulation but then you need to be quick to stop it at the right moment. It can be
painful.

To address the issue I have developed an experimental debugger which looks for moments of "period breaks".
To use it zoom to a small which processes a sparse signal and press to "Run to Signal" button.
 

- The debugger draws the first *period* generations onto a small canvas without clearing it between them, this way collecting
a snapshot of all the cells that are active during normal periodic work.
- Then it switches to high speed by drawing only every 2^*step* generations. Thanks to the Hashlife algorithm the simulation is very fast when the inner generations are not rendered.
- For every drawn generation it checks if there is any live cell which is not marked in the snapshot.
If it finds one that must be part of the signal 

You may need to tune the parameters: Use higher *step* if you are working with the hour or AM/PM displays,
and enter a high enough *period* if the debugger stops immediately without finding a signal. Don't forget to
zoom in to a small area as the larger ones are not periodic and the canvas used to collect the snapshot is small.  

### Embedding

TODO This section is a stub. 

I run it on a Raspberry Pi 3 Model B using Chromium kiosk mode.
On a low-end device like the rpi you have to configure the JavaScript heap with command line flags.
Use clock.sh to start the browser.  

### TODOs

- Allow editing and provide usable editor tools and a better debugger
- Fix the memory leak correctly (only a workaround is done)
- Remove unneeded code from the original simulator
 
### Thanks

The original clockwork was designed by dim (<a href="https://codegolf.stackexchange.com/questions/88783/build-a-digital-clock-in-conways-game-of-life/" target="_blank">see the post</a>),
I only tuned it a bit.

The player is based on <a href="https://github.com/copy/life" target="_blank">life</a> by copy.
