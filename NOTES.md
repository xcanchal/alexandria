# Building Alexandria

### Contracts and data structures size

### Which layer to use (L1 Ethereum, L2 Matic...)

Pros and cons of using an L2 solution such as Matic over Ethereum:

From a developer perspective:

When using Ethereum (layer 1), testing is a bit of a pain in the ass. Rinkeby is fast but there aren't many faucets and those that work drip little amounts of $ETH. Ropsten is better in that regard but in my experience, it's too slow validating transactions so not very much efficient for developing.

Adding Matic to the wallet networks is pretty easy (EXPLAIN HOW?) and configuring Alchemy and Hardhat for deploying contracts is not different than doing it with Ethereum at all. In terms of transaction validation speed it's quite good and funding the wallet with test tokens was easy too. The first faucet I found dripped me 1 $MATIC in a single transaction, and since the transaction fees are lower, it lasted me long enough to not having to worry for funding again in a considerable period of time.

From a user perspective:

Pros

- Lower transaction costs (fees) and transaction validation time.

Cons

- Another "level" of complexity added. They have to to configure a new network and buy $MATIC tokens to operate with.

### How to efficiently store and retrieve the data (arrays, mappings...). Best-practices/design patterns

### Access level modifiers (data visibility and ownership)
