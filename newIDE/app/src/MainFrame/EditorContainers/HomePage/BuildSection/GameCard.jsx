// import { useContext, useState, useEffect } from 'react';
// import { GameContext } from '../../../../GameContext/GameContext';
// import FlatButton from '../../../../UI/FlatButton';
// import { Trans } from '@lingui/macro';
// import Loader from './Loader';
// import './NFTCard.css';

// const shortenAddress = address =>
//   `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

// const GameCard = ({ nft, onProfilePage }) => {
//   const { nftCurrency, buyNftWithaccessID, isLoadingNFT } = useContext(GameContext);
//   const [isBought, setIsBought] = useState(false);

//   const handleBuy = async () => {
//     await buyNftWithaccessID(nft.accessId, nft.price);
//     setIsBought(true);
//   };

//   const handlePlay = () => {
//     // i have to redirect to the play section
//   };

//   return (
//     <div className="nft-card">
//       <div className="image-container">
//         <img
//           src={nft.imageURL}
//           className="image"
//           alt={`nft${nft.i}`}
//         />
//       </div>
//       <div className="details">
//         <p className="name">{nft.name}</p>
//         <div className="price-address">
//           <p className="price">
//             {nft.price} <span className="currency">{nftCurrency}</span>
//           </p>
//           <p className="address">
//             {shortenAddress(onProfilePage ? nft.owner : nft.seller)}
//           </p>
//         </div>
//       </div>
//       <div className="price">
//         {/* Conditionally render button based on NFT ownership */}
//         {isBought ? (
//           <FlatButton label={<Trans>Play</Trans>} onClick={handlePlay} />
//         ) : (
//           <FlatButton label={<Trans>Buy</Trans>} onClick={handleBuy} />
//         )}
//       </div>

//       {isLoadingNFT && (
//         <div className="flexCenter flex-col text-center">
//           <div className="relative w-52 h-52">
//             <Loader />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameCard;

// import React, { useContext, useState, useEffect } from 'react';
// import { GameContext } from '../../../../GameContext/GameContext';
// import FlatButton from '../../../../UI/FlatButton';
// import { Trans } from '@lingui/macro';
// import Loader from './Loader';
// import './NFTCard.css';

// const ethers = require('ethers');

// const shortenAddress = address =>
//   `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

// const GameCard = ({ nft, onProfilePage }) => {
//   const { nftCurrency, buyNftWithaccessID, isLoadingNFT, hasBoughtNFT } = useContext(GameContext);
//   const [isBought, setIsBought] = useState(false);
//   const [isOwned, setIsOwned] = useState(false);

//   useEffect(() => {
//     const checkOwnership = async () => {
//       if (nft && nft.accessId) {
//         const owned = await hasBoughtNFT(nft.accessId);
//         setIsOwned(owned);
//       }
//     };

//     checkOwnership();
//   }, [nft, hasBoughtNFT]);

//   const handleBuy = async () => {
//     console.log('Clicked Buy button with accessId:', nft.accessId);
//       const price = ethers.parseUnits(nft.price.toString(), 'ether');

//     try {
//       await buyNftWithaccessID(nft.accessId, price);
//       setIsBought(true);
//       setIsOwned(true);
//     } catch (error) {
//       console.error("Error buying NFT:", error);
//     }
//   };

//   const handlePlay = () => {
//     // Redirect to the play section
//   };

//   return (
//     <div className="nft-card">
//       <div className="image-container">
//         <img
//           src={nft.imageURL}
//           className="image"
//           alt={`nft${nft.i}`}
//         />
//       </div>
//       <div className="details">
//         <p className="name">{nft.name}</p>
//         <div className="price-address">
//           <p className="price">
//             {nft.price} <span className="currency">{nftCurrency}</span>
//           </p>
//           <p className="address">
//             {shortenAddress(onProfilePage ? nft.owner : nft.seller)}
//           </p>
//         </div>
//       </div>
//       <div className="price">
//         {/* Conditionally render button based on NFT ownership */}
//         {isOwned ? (
//           <FlatButton label={<Trans>Play</Trans>} onClick={handlePlay} />
//         ) : (
//           <FlatButton label={<Trans>Buy</Trans>} onClick={handleBuy} />
//         )}
//       </div>

//       {isLoadingNFT && (
//         <div className="flexCenter flex-col text-center">
//           <div className="relative w-52 h-52">
//             <Loader />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameCard;

import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../../../../GameContext/GameContext';
import FlatButton from '../../../../UI/FlatButton';
import { Trans } from '@lingui/macro';
import Loader from './Loader';
import './NFTCard.css';
import { ethers } from 'ethers';

const shortenAddress = address =>
  `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;

const GameCard = ({ nft }) => {
  const { nftCurrency, isLoadingNFT, buyNftWithaccessID } = useContext(
    GameContext
  );
  const [isBought, setIsBought] = useState(false);
  const external_urls = 'https://gateway.pinata.cloud/';

  // useEffect(
  //   () => {
  //     const checkIfBought = async () => {
  //       const isNFTBought = await checkNFTBought(nft.id);
  //       setIsBought(isNFTBought);
  //     };

  //     checkIfBought();
  //   },
  //   [nft.id]
  // );

  const handleBuy = async () => {
    console.log('Clicked Buy button with accessId:', nft.accessId);
    const price = ethers.parseUnits(nft.price.toString(), 'ether');

    try {
      await buyNftWithaccessID(nft.accessId, price);
      setIsBought(true);
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  };


  const handlePlay = () => {
    // Open the preview of the game using the zip url, download the zip and use it to open the game
    const url = {
      url: nft.fileURL, // Assuming nft.fileURL contains the URL
    };


    const play = async ()=>{const response = await fetch('http://localhost:3001/play', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(url),
    });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    }


    play()

    async function waitTwoSeconds() {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    (async () => {
      await waitTwoSeconds();
      window.open("http://localhost:3003")
    })();
    
  };

  console.log("nft --- gamecard ----  >>>", nft)

  
  return (
    <div className="nft-card">
      <div className="image-container">
        <img src={nft.imageURL} className="image" alt={`nft${nft.i}`} />
      </div>
      <div className="details">
        <p className="name">{nft.name}</p>
        <div className="price-address">
          <p className="price">
            {nft.price} <span className="currency">{nftCurrency}</span>
          </p>
          <p className="address">
            {shortenAddress(nft.isBought ? nft.owner : nft.seller)}
          </p>
        </div>
      </div>
      <div className="price">
        {/* Conditionally render button based on NFT ownership */}
        {nft.isBought ? (
          <FlatButton label={<Trans>Play</Trans>} onClick={handlePlay} />
        ) : (
          <FlatButton label={<Trans>Buy</Trans>} onClick={handleBuy} />
        )}
      </div>

      {isLoadingNFT && (
        <div className="flexCenter flex-col text-center">
          <div className="relative w-52 h-52">
            <Loader />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;
