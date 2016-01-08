# Esti

> :one: :two: :three: :five: :eight: :one::three:

## Install

```js
npm install esti
```

Acquire user token from JIRA:

```sh
# todo
```

## Usage

### Claim a room

Project managers can claim a room by just accessing it and connecting it to his JIRA account.
After an inactivity of at least 30 days rooms may be freed, to ensure privacy (we then delete the JIRA OAuth2 tokens)

```sh
$ open https://esti.io/hwz-daily
```

### Enter a room

Just open the link in your browser and set a name.
Settings are persisted via local storage / cookies so you don't have to do it each time.
You can also specify it behind the room name for additional slickness.
Please note that you might get kicked from the PM, if you do not belong into this room.

```sh
$ open https://esti.io/hwz-daily/zcei
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/yannickoo/esti/issues/new).
But before doing anything, please read the [CONTRIBUTING.md](./CONTRIBUTING.md) guidelines.
