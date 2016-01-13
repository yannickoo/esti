'use strict';

export function groupByVote(allVotes, vote) {
  const points = vote.points;
  const user = vote.user;
  const alreadyVoted = allVotes[points] || [];

  const votes = [...alreadyVoted, user];

  return Object.assign({}, allVotes, { [points]: votes})
}
