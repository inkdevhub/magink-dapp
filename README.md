# Swanky Magink! School <br/>
![swanky school](https://github.com/swanky-dapps/magink-dapp/assets/34627453/107adca8-3c94-4d5c-8bce-4a0d7c7d1f7f)
[![workflow][a1]][a2] [![stack-exchange][s1]][s2] [![discord][d1]][d2] [![built-with-ink][i1]][i2] [![License][ap1]][ap2]

[s1]: https://img.shields.io/badge/click-white.svg?logo=StackExchange&label=ink!%20Support%20on%20StackExchange&labelColor=white&color=blue
[s2]: https://substrate.stackexchange.com/questions/tagged/ink?tab=Votes
[a1]: https://github.com/swanky-dapps/nft/actions/workflows/test.yml/badge.svg
[a2]: https://github.com/swanky-dapps/nft/actions/workflows/test.yml
[d1]: https://img.shields.io/discord/722223075629727774?style=flat-square&label=discord
[d2]: https://discord.gg/Z3nC9U4
[i1]: /.images/ink.svg
[i2]: https://github.com/paritytech/ink
[ap1]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[ap2]: https://opensource.org/licenses/Apache-2.0

<br clear="both"/>

This is an example dApp using `ink!` smart contract and `useink` React library. It has 2 purposes:
1. This is the template dApp with the task for developers on how to extend it.
2. Collect magink! badges by learning some facts about ink! smart contract language and Astar Network. 

To better understand this dApp/task please play the [Swanky Magink! School](https://swanky-dapps.github.io/magink-dapp/) and collect all badges.

<br clear="both"/>

## How to Extend the dApp?
If you are dApp developer, here is the idea on how you can extend this dApp. Your task will be to extend this dApp with NFT minting functionality. 

### What should be used
- Shibuya testnet
- ink! v4.2.1
- ink! events
- ink! end-to-end tests
- ink! unittest
- contract-UI
- Interacting with contract from the frontend using `useink` library
- PSP34 from Openbrush
- cargo contract v3

### Wizard PSP34 smart contract
- Use this magink repository as a template. On this repo press **Use this template** and create your version of it.
    - give a Star to the magink! repo :)
 
- Create `wizard` PSP34 smart contract for Wizard-NFTs.
    - Use ink! v4.2.1 with cargo-contract v3+
    - Use [Nft](https://docs.astar.network/docs/build/wasm/from-zero-to-ink-hero/nft/) tutorial to learn how to create and extend PSP34
    - Make as simple as possible PSP34 contract. No need for payment.
    - Wizard-NFT can only be minted by magink contract
    - Implement Transfer event for NFT minting
    - Use Ownable PSP34 extension
    - Deploy wizard image from `src/assets/wizard.png` to ipfs and use it for all NFTs. You have freedom to add any other image as well.
    - Total supply of NFTs is up to you, just like any other parameter or function you want to add. Feel free to use Shiden34 example, just update it to use ink-4.2

### Magink! smart contract
- Use ink! 4.2.1 and cargo-contract v3+
- Extend `magink` contract to be able to mint Wizard-NFT
    - name the new function `mint_wizard` and within it make a cross contract call to `mint` in the wizard contract
    - This `mint_wizard` method can be called only if the user has collected all badges (or you can come up with your criteria)
    - use [manic-minter](https://docs.astar.network/docs/build/wasm/from-zero-to-ink-hero/manic-minter/) tutorial to learn about cross contract calls
    - write ink_e2e test for `mint_wizard` call
    - create ink unit-test for all new functionality. Except what is covered by ink_e2e tests

### Frontend integration
- Use existing frontend from this template
- When user collects all badges show new `Mint` Button instead of `Claim`
- When user presses `Mint` button, call `mint_wizard`. To understand what you need to do, explore existing `Start`button.

### Deployment
- Both contracts `magink` and `wizard` need to be deployed on Shibuya Testnet
    - find Shibuya faucet and claim tokens. You will get the instructions while playing `Swanky Magink! School`
    - Use [Contracts-UI](https://contracts-ui.substrate.io/) for deployment and testing
For the development you can use `chains: [Development]` in [index.tsx](https://github.com/swanky-dapps/magink-dapp/blob/8d63b3f5d8608e3a8883df236b13f63c7913c460/frontend/src/index.tsx#L15)
- Deploy your finished frontend on any of the free services like as [Github.io](http://Github.io) page, [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
    - Swanky Magink School template already supports github.io. You will just need to change the *homepage* in package.json to point to your repository. To deploy it, run `yarn deploy` and on your github repo configure Settings→Pages to point to `gh-pages` branch after you have deployed the project.

- (optional) Take a look at other Swanky-dapps and create Github workflow (CI)
- 
## Smart Contract Deployment

The Magink! contract is deployed on Shibuya testnet at the following address:
```
apJNVQJ5T4C5gZ1XRPw2MAHcUFxbuHch7BPGQuTyT8DHjeX
```
Its metadata can be [found here](./frontend/src/metadata.json). 

## The frontend
The frontend is build with [useink](https://github.com/paritytech/useink) library and uses template from [link!](https://use.ink/examples/dapps) example.
