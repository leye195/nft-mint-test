# NFT Mint Test

## FrontEnd

### How to run?

Install

```
yarn install
```

Run

```
yarn dev
```

## Contracts

### How to test on local?

**1. Remix(https://remix.ethereum.org/)**

```
# install @remix-project/remixd
yarn global add @remix-project/remixd

# move into contracts folder and run this command
remixd -s . --remix-ide https://remix.ethereum.org/

```

Click Access File System and Connect

https://github.com/leye195/nft-mint-test/assets/30601503/be05ed40-665d-47ca-aa5b-5601e1af2bc6

**2. Truffle**

- install ganache-cli

```
yarn add -D ganache-cli

```

- compile & run ganache

```
npx truffle compile

npx ganache-cli --deterministic
```

- deploy on local network

```
npx truffle migrate --compile-all --reset  --network development
```

https://github.com/leye195/nft-mint-test/assets/30601503/8f316893-6b21-408e-86c9-c07cb0749b85

- interact from console

```
# make sure you are on contracts folder

npx truffle console --network development
```

https://github.com/leye195/nft-mint-test/assets/30601503/7ddb29e7-24aa-4270-a322-106082bd25c7
