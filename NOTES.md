# Building Alexandria

The first question that comes to my mind is: how should I structure data? Are there any kind of best-practice design patterns?

### First worries

- Contract and data size
- How to efficiently look for and retrieve the different data
- Access level modifiers (data visibility and ownership)

### Access level modifiers in Solidity

- Public - Accessible by anyone
- Private - Accessible by only contracts where they are defined and not by inheriting contracts.
- Protected - Accessible by only contracts where they are defined and by contracts that inherit them.
- Internal - Accessible by only other functions of the contract and not by other people or contracts.
- External - Accessible by only other people or contracts and not by functions.

### Some data structures

#### Arrays

pros:
cons:

#### Mappings

pros:
cons:

What if we store data in both ways? Is that a good approach?

