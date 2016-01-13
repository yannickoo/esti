import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

import SocketIO from './vendor/socket-driver';

import { groupByVote } from './lib/pm';

var computer = function ({socketIO, dom}) {
  const userVotes$ = Rx.Observable
    .interval(500 /* ms */) // socketIO.get('user:vote')
    .map(() => ({ user: 'foo', points: Math.floor(Math.random() * (14 - 1)) + 1 }))
    .scan(groupByVote, {});

  const vtree$ = userVotes$.map((votes) => {
    return CycleDOM.h1(`${Object.keys(votes).join('|')}`)
  });

  return {
    dom: vtree$
  };
};

var socketIODriver = SocketIO.createSocketIODriver(window.location.origin);
var domDriver = CycleDOM.makeDOMDriver('#esti');

Cycle.run(computer, {
  dom: domDriver,
  socketIO: socketIODriver
});
