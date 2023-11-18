## 🍅 AA-tomato 🍅

Demystifying account abstraction – Get ya wallet, all you need is a fingerprint and get access to true Account Abstraction ERC 4337. Enables you to automate complex actions based on triggers and conditions in a safe way by remaining in full control and custody.

## Deployed Contracts

### Goerli

| Contract              | Address                                    | Explorer                                                                       |
| --------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| ComplexAccountFactory | 0xB3a3a075e38B1DB86F7032F7A9c1e529Fbe764bd | https://goerli.etherscan.io/address/0xB3a3a075e38B1DB86F7032F7A9c1e529Fbe764bd |
| MockERC721            | 0x4ED05DD4b0149DeDa80EA26683B2EF72820e3E0F | https://goerli.etherscan.io/address/0x4ED05DD4b0149DeDa80EA26683B2EF72820e3E0F |
| MockERC20             | 0x085278Ada5eD92D9098496af049903ec43F732AC | https://goerli.etherscan.io/address/0x085278Ada5eD92D9098496af049903ec43F732AC |

### Base Goerli

| Contract              | Address                                    | Explorer                                                                       |
| --------------------- | ------------------------------------------ | ------------------------------------------------------------------------------ |
| ComplexAccountFactory | 0x22E9cd80fFbE5d05a093a07C3E7FBc40F83033C0 | https://goerli.basescan.org/address/0x22e9cd80ffbe5d05a093a07c3e7fbc40f83033c0 |
| MockERC721            | 0x70759504EBcCdbAC928129eE3c07E1551F48B34c | https://goerli.basescan.org/address/0x70759504EBcCdbAC928129eE3c07E1551F48B34c |
| MockERC20             | 0x5c8C5Ac4Fa45655cB094b3b1eED4f7A6C67a7f1B | https://goerli.basescan.org/address/0x5c8C5Ac4Fa45655cB094b3b1eED4f7A6C67a7f1B |

### Linea Goerli

| Contract              | Address                                    | Explorer                                                                          |
| --------------------- | ------------------------------------------ | --------------------------------------------------------------------------------- |
| ComplexAccountFactory | 0xD64f7938db423cf2e230385d0fc6408BD6eA4370 | https://goerli.lineascan.build/address/0xD64f7938db423cf2e230385d0fc6408BD6eA4370 |
| MockERC721            | 0xD8F1c55315C85e68C87a87182B40B74132828Da5 | https://goerli.lineascan.build/address/0xD8F1c55315C85e68C87a87182B40B74132828Da5 |
| MockERC20             | 0xfd592a0C40Fe0D9803c538a99f58Cc516eE10437 | https://goerli.lineascan.build/address/0xfd592a0C40Fe0D9803c538a99f58Cc516eE10437 |

### Scroll Sepolia

| Contract              | Address                                    | Explorer                                                                          |
| --------------------- | ------------------------------------------ | --------------------------------------------------------------------------------- |
| ComplexAccountFactory | 0x248De4104EDA64b033b21Cc3b9E36d29161fB6dB | https://sepolia.scrollscan.com/address/0x248De4104EDA64b033b21Cc3b9E36d29161fB6dB |
| MockERC721            | 0x215B55D47583EaAC93cDc9316afeDE059674FCd2 | https://sepolia.scrollscan.com/address/0x215B55D47583EaAC93cDc9316afeDE059674FCd2 |
| MockERC20             | 0x3DA56cC67Ef4FE12347c0678dFD4C66e6ca0c81f | https://sepolia.scrollscan.com/address/0x3DA56cC67Ef4FE12347c0678dFD4C66e6ca0c81f |

# Turborepo starter

This is an official starter Turborepo.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `ui`: a stub React component library shared by both `web` and `docs` applications
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
