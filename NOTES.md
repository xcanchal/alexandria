# Building Alexandria

## Introduction

Alexandria is a global, open, and decentralized knowledge hub. Alexandria is a place where to ask questions and provide answers. A permanent knowledge hub that can't be censored nor taken down where users can ven get rewarded for their contribution to the community.

The information in Alexandria is organized in a very simple way. Users can create topics, which then can contain questions and these questions get answers. As simple as that. Users just need to connect their wallets to explore the hub. In order to publish any kind of data, they also have to sign up as users and provide a little info about themselves.

## Contracts and data modeling

### Storing and retrieving data

In Ethereum, Smart Contracts are stateful, and all the data lives inside the contract, which means that it will keep growing over time. In order to efficiently manipulate it (in terms of gas and time), we must model it in a proper way. Are there any best-practices / recommended design patterns to follow? What about the size limits for storing that data? [Read more](https://dev.to/mrhmp/evolving-ethereum-smart-contracts-in-production-without-dataloss-2196)

### Size limits: ???

### Design patterns

Upgradeable contracts: Separate data and logic in different contracts. One contract holds the data structures and mappings, getters/setters and another one holds the business logic. What if the data structure changes too, though?

Proxy contracts: Use delegateCalls to call remote contract code with proxy contract state (sender, addres...).

Diamond pattern: [Read more](https://eip2535diamonds.substack.com/p/introduction-to-the-diamond-standard)
- From the outside, it appears to be a single contract but in reality, there are different contracts (called facets) for different purposes.
- The data is stored in the diamond.

Some things to avoid:

- Having to iterate over arrays for searching or filtering: It's better to use mappings if possible (constant time complexity). In Alexandria, for instance, everytime that a user publishes a question to a category, the contract adds a new element to the `questionsByCategoryId` mapping (with key: `categoryId` and value: `Question`), so when the users request questions from a topic, the contract simply has to access `questionsByCategoryId[categoryId]` with time complexity O(1). Every decision of this kind always come with a trade-off, and when we talk about time/space complexity, sometimes you need to sacrifice one to benefit the other. In this case, creating new mapping requires more space improve efficiency when querying data.

### Relationships between data

When modeling data structures, it's common to have relationship between different models. For instance, in Alexandria we have two different entities: `Answer` and `User`. When showing a list of answers under a question, we want to display the `username` of the user that created it. The only information that the `Answer` has about the user is the `id`, the username is stored under `User`. How to efficiently query these? Different solutions come to my mind:

- Creating extra data structures with normalized data (a more non-relational database approach). For instance, having a `DetailedAnswer` that holds all that information and is only used for displaying data, whereas the `Answer` is the source of truth for other operations. Problem? Having duplicate information and having to maintain all entities updated all the time, but since querying on the blockchain is not very efficient, we might again want to sacrifice space for time.

Is important to list the data models that we need and the queries that we'll need to perform to try to come up with the best data structures. This is not a particular problem for blockchain or Ethereum applications but for software design in general. What is important is to know the features or limitations of the technologies that you're going to use to take appropriate decisions. An example from Alexandria:

- Topic: Create a topic, list all topics...
- Question: Create question, list all questions from a topic...
- Answer: Create an answer, update an answer, list all answers from a question, upvote/downvote an answer...
- User: Create a user, update a user bio or avatar, send tip...

### Contracts organization (project architecture)

How many contracts to create? A single or multiple ones. For this, I took the approach of creating a separate contract for each entity with its use-cases. Some of the benefits of splitting the contracts are:

- Single responsibility
- Partial application updates (not affecting all app for a change in a small part of it)
- Size and deployment cost
- Maintainability

Some questions:

- How to call functions in other contracts? Each contract gets deployed to an address. To tell a contract B about another contract A, the address of the contract A must be sent in the constructor when instantiating B. Then B, can initialize and store A as a state variable pointing to the contract's address and call its functions.

### Data migration

Ethereum contracts can't be upgraded. If a contract needs to get updated because of adding new features or fixing existing ones, it needs to be redeployed to another address. So, how can we migrate data?

For now, I'm redeploying all the contracts to a new address everytime, and therefore, wiping all the data out on the web app eyes, but I will need to investigate further on this.

Other pain points:

- Data validation (use modifers...)

## Scalability and usage

### Which layer to use (L1 Ethereum, L2 Matic...)

Pros and cons of using an L2 solution such as Matic over Ethereum:

From a developer perspective:

When using Ethereum (layer 1), testing in development or staging environments is a bit of a pain in the ass. Rinkeby is fast but there aren't many faucets and those that I found that work, drip little amounts of $ETH. Ropsten is better in that regard but at least from my experience, it's too slow validating transactions hence not efficient for developing.

OK, BUT ROPSTEN WORKS LIKE MAINNET AND RINKEBY DOE SNOT. GOOD POINT. TO GET A BEHAVIOR THAT RESEMBLES MORE MAINNET, YOU CAN USE ROPSTEN FOR STAGING AND RINKEBY FOR DEVELOPMENT!

Adding Matic to the wallet networks is pretty easy (EXPLAIN HOW?) and configuring Alchemy and Hardhat for deploying contracts is not different than doing it with Ethereum at all. In terms of transaction validation speed it's quite good and funding the wallet with test tokens was easy too. The first faucet I found and used (https://faucet.polygon.technology/) dripped me 1 $MATIC (priced around 1.8 USD at the time) in a single transaction, and since the transaction fees are lower in L2, it lasted me long enough to not having to worry for funding again in a considerable period of time.

From a user perspective:

Pros

- Lower transaction costs and faster transaction validation time.

Cons

- Another "level" of complexity added. They have to to configure a new network and buy $MATIC tokens to use the dApp.

## Security

- Private key: Set it environment and never uplad it to Github or any other site where other people can see it or all your funds can be stolen.

## Conclusion

Things I like about Ethereum:

- Modifiers

Things I dislike about Ethereum:

- Contracts can't be updated (and data lives in the contract)
