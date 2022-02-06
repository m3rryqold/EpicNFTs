// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

//import helper base64 functions
import { Base64 } from "./libraries/Base64.sol";

// We inherit the contract we imported. This means we'll have access
// to the inherited contract's methods.
contract MyEpicNFT is ERC721URIStorage {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // This is our SVG code. All we need to change is the word that's displayed. Everything else stays the same.
    // So, we make a baseSvg variable here that all our NFTs can use.
    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    //three arrays with random words, theme is an adjective,a position, rank or occupational label, and a proper noun.
    string[] firstWords = ["Charming","Perfect","Lanky","Gentle","Zealous","Frisky","Arrogant","Clumsy","Wierd","Lonely","Abnormal","Bald","Artistic","Witty","Cute","Silly","Hilarious","Sexy","Hot","Fearless","Happy","Fierce","Messy","Articulate","Sporty","Famished","Thoughtful","Rouge","Jocular","Discreet","Decent","Sleek","Dynamic"];

    string[] secondWords = ["Doctor","Captain","Sailor","Detective","King","Pilot","Cowboy","Senior","Major","Boss","General","Chef","Corporal","Agent","Instructor","Developer","Producer","Manager","Analyst","Host","Banker","Singer","Lieutenant","Actor","Stranger","Writer","Architect","Junior","Officer","Priest","Gardener","Singer","Contractor"];

    string[] thirdWords = ["Mask","Nutella","Hat","Pine","Candy","Tofu","Bear","Lamp","Chocolate","Ring","Burger","Lollipop","Pin","Mouse","Bat","Screw","Gate","Seed","Lock","Land","Key","Rock","Paper","Scissors","Slippers","Pants","Tank","Neon","Moon","Earth","Switch","Basket"];

 
    // We need to pass the name of our NFTs token and its symbol
    constructor() ERC721 ("Hunt3rNFT", "Hunt3er") {
        console.log("WAGMI");
    }

    //functions to pick a random word from each array
    function pickRandomFirstWord(uint256 tokenId) public view returns (string memory) {
        //seed random generator
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        //Squash the # between 0 and the array length to avoid going out of bounds
        rand = rand % firstWords.length;
        return firstWords[rand];
    }

    function pickRandomSecondWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));
        rand = rand % secondWords.length;
        return secondWords[rand];
    }

    function pickRandomThirdWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));
        rand = rand % thirdWords.length;
        return thirdWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    //A function our user will hit to get their NFT.
    function makeAnEpicNFT() public {
        // Get the current tokenID, this starts at 0.
        uint256 newItemId = _tokenIds.current();

        //we randomly grab one word from each of the three arrays
        string memory first = pickRandomFirstWord(newItemId);
        string memory second = pickRandomSecondWord(newItemId);
        string memory third = pickRandomThirdWord(newItemId);
        string memory combinedWord = string(abi.encodePacked(first,second,third));

        //we concatenate the 3 words with the base svg and close it.
        string memory finalSvg = string(abi.encodePacked(baseSvg,combinedWord, "</text></svg>"));

        //Get all the JSON metadata in place and base64 encode it
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        //Set the title of our NFT as the generated word.
                        combinedWord,
                        '","description":"Super cruise level titles for you.", "image":"data:image/svg+xml;base64,',Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        //prepend data:application/json;base63 to our data
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,",json)
        );

        console.log("\n------------------");
        console.log(
            string(
                abi.encodePacked(
                    "https://nftpreview.0xdev.codes/?code=",
                    finalTokenUri
                )
            )
        );
        console.log("------------------\n");

        // Mint the NFT to the sender using msg.sender
        _safeMint(msg.sender, newItemId);

        // Set the NFTs data.
        _setTokenURI(newItemId, finalTokenUri);

        // Increment the counter for when the next NFT is minted.
        _tokenIds.increment();
        console.log("NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
    }
}