import { slug } from './utils'

export default class Room {
  constructor (name) {
    this.name = name
    this.slug = slug(name)
    this.users = []
    this.round = {}
  }

  addUser (user) {
    const exists = this.findUser(user)

    if (!exists) {
      this.users = [...this.users, user]
    }

    return this
  }

  findUser (user) {
    return this.users.find((u) => u.socket === user.socket)
  }

  updateUser (user) {
    const current = this.findUser(user)
    const next = { ...current, ...user }

    this
      .removeUser(current)
      .addUser(next)

    return next
  }

  removeUser (user) {
    const users = this.users
      .filter((u) => u.socket !== user.socket)

    this.users = users

    return this
  }

  startVoteRound () {
    const users = this.users.filter((u) => !u.pm)

    this.round = { votes: [], finished: false, users }
  }

  setRoundVote (user, value) {
    const u = this.findUser({ socket: user })
    const vote = { user: u, estimation: value }
    const index = this.round.votes.findIndex((v) => {
      return u.socket === v.user.socket
    })

    if (index !== -1) {
      this.round.votes[index] = vote
    } else {
      this.round.votes.push(vote)
    }
  }

  roundFinished () {
    const users = this.round.users.filter((u) => !u.pm)
    const finished = this.round.votes.length === users.length

    if (finished) {
      this.round.finished = true
    }

    return finished
  }

  getRecommendedPoints () {
    // Object of point objects containing amount of votes.
    const allPoints = this.round.votes.reduce((points, vote) => {
      const userVote = Number.parseInt(vote.estimation, 10)

      points[userVote] = points[userVote] || 0
      points[userVote]++

      return points
    }, {})

    // Minimum amount of two because a recommendation for a point with only one
    // user is not really helpful.
    let maxVotes = 2
    // Array of recommended points.
    const recommended = Object.keys(allPoints).reduce((all, point) => {
      if (allPoints[point] < maxVotes) {
        return all
      }

      maxVotes = allPoints[point]

      return [...all, point]
    }, [])

    return recommended
  }
}
