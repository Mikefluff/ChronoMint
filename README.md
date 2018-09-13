
# ChronoMint [![Build Status](https://travis-ci.org/ChronoBank/ChronoMint.svg?branch=master)](https://travis-ci.org/ChronoBank/ChronoMint) [![Coverage Status](https://coveralls.io/repos/github/ChronoBank/ChronoMint/badge.svg)](https://coveralls.io/github/ChronoBank/ChronoMint) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
Control panel for ChronoBank

## Install
```bash
yarn
```

## Development
Start TestRPC in a separate terminal by doing:
```bash
yarn testrpc
```

Then in another separate terminal (optional):
```bash
yarn bridge
```

Wait for _Listening @..._ message and don't exit from this process!

After that deploy contracts with:
```bash
yarn contracts
```

And finally:
```bash
yarn start
```

Now you able to access ChronoMint dApp through the [http://localhost:3000/](http://localhost:3000/)

To open truffle console use:
```bash
yarn tconsole
```

## Test
Run both e2e & unit tests by
```bash
yarn test
``` 

###Unit
Run all test suite files matched `*.spec.js` pattern
```bash
yarn test:unit
```
To test separate specs just add your regex at the end of this command. Ensure what `yarn testrpc` is already ran in separate console

###E2E
#### Install
```bash
yarn selenium-server:install
```
####Run all test suite files matched `*.test.js` pattern
Note, the app should be launched
```bash
yarn selenium-server:start
yarn test:e2e
```


## License
 [GNU AGPLv3](LICENSE)

## Copyright
LaborX PTY