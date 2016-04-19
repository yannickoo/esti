# Esti [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![Build Status](https://travis-ci.org/yannickoo/esti.svg?branch=master)][build-status] [![Dependency Status](https://david-dm.org/yannickoo/esti.svg)][dependency-status]

## Say what :question:

Esti is a tool which helps you organizing voting rounds. You can create a room for your voting and invite other users to it. After they have joined you can ask a question which can be answered by predefined options. You find the average answer and select the winner. That's it. In my case I'm using Esti for scrum projects which need an estimated backlog and Esti helps us.

## Motivation :battery:

It's annoying when doing backlog estimation meetings remotely and you need to write all points on pieces of paper. Then you need to show your estimation in the webcam so your project manager can see that. Welcome to the year 2016 :tada: Let's do something useful with our time and simply join a room where all developers can simply vote without getting influenced by others :hatching_chick:

## Demo :tv:

You can start by creating a new room on [esti.io](https://esti.io). Check the [wiki](https://github.com/yannickoo/esti/wiki) for a step by step tutorial.

## Install :point_up:

```sh
# Clone repository
$ git clone https://github.com/yannickoo/esti.git
# Go into repository
$ cd esti
$ npm install && npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

## Tech Stack :neckbeard:

* [Riot.js](http://riotjs.com) + [Jade](http://jade-lang.com/)
* [Redux](http://redux.js.org)
* [Socket.IO](http://socket.io)
* ES6 via [Babel](https://babeljs.io)

## Contributing :hammer:

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/yannickoo/esti/issues/new).

---

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CSBARGZNZ6QPC
[build-status]: https://travis-ci.org/yannickoo/esti
[dependency-status]: https://david-dm.org/yannickoo/esti
