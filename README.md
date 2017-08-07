
![alt text](https://zencode.me/wp-content/uploads/2013/11/Peek-2017-08-06-21-54-1.gif "Liftoff!")
# Kalmans Rocket #
A simple physics simulator with hopes of being a machine learning test platform. It's named after the famed engineer [Rudolf E. Kálmán](https://en.wikipedia.org/wiki/Rudolf_E._K%C3%A1lm%C3%A1n).

Currently only supports Firefox, but Chrome works but has some visual bugs which are currently being looked at.

Current Todo List:
* Add better steering - ship currently pivots on the parent stage. Needs to shift the trust vector.
* Flight Control Systems - Needs a simple flight control loop for automated flight.
* Flight Path Visualization - Rendered future orbital path.
* Landing Barge and Ground Structures - Because Landing the first stage would be fun. :)


## How To Run ##
Install the dependencies.

`npm i`

Start the development web server.

`npm run dev`

## Acknowlegments ##
* This is a partial port of zlynn1990 to the web.
https://github.com/zlynn1990/SpaceSim

* Phaser ES6 Boilerplate - goldfire/phaser-boilerplate.git
* Kenney.nl - UI Images
