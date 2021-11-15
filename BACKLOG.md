# Feature requests

- User stats
- Board with proposed categories by the people and as long as a category reaches X votes, it gets automatically created? Users can propose a category and then a poll starts. See "polls" page.
- List latest posted questions
- Using NFTs (validated) as avatar. In the meantine, at least publish avatars to IPFS or Arweave.
- Add followingTags to users for curating latest questions


# Technical improvements

- Deploy to Matic (Polygon) for cheap
- I should decide how to store data to be efficiently retrieved by an attribute's id. For instance, get all questions from a category given a categoryId.
- Check out testing tools like MythX, Slither, Echidna, Mythril.
- Sign up for a dedicated free RPC URL using services like Infura, MaticVigil, QuickNode, Chainstack, or Ankr (instead of Alchemy public one, which may have rate limits)
- Add web3modal to UI
- Set a maxLen to text inputs
- Categories might need a "userId" attribute to know who created a category. Users must register as users before being able to create categories, questions, answers...