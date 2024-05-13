// @flow
import { t, Trans } from '@lingui/macro';
import * as React from 'react';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import {
  type ChooseResourceOptions,
  type ResourceSourceComponentProps,
  type ResourceSource,
  allResourceKindsAndMetadata,
} from '../ResourcesList/ResourceSource';
import { ResourceStore } from './ResourceStore';
import path from 'path-browserify';
import { Line } from '../UI/Grid';
import { ColumnStackLayout, TextFieldWithButtonLayout } from '../UI/Layout';
import RaisedButton from '../UI/RaisedButton';
import SemiControlledTextField from '../UI/SemiControlledTextField';
import { useDebounce } from '../Utils/UseDebounce';
import axios from 'axios';
import AlertMessage from '../UI/AlertMessage';
import { FileToCloudProjectResourceUploader } from '../ResourcesList/FileToCloudProjectResourceUploader';
import {
  extractDecodedFilenameWithExtensionFromPublicAssetResourceUrl,
  isPublicAssetResourceUrl,
} from '../Utils/GDevelopServices/Asset';
import { NFTContext } from '../context/NFTContext';
import useForceUpdate from '../Utils/UseForceUpdate';
import NFTCard from '../MainFrame/EditorContainers/HomePage/BuildSection/NFTCard';

const gd: libGDevelop = global.gd;
type ResourceStoreChooserProps = {
  options: ChooseResourceOptions,
  onChooseResources: (resources: Array<gdResource>) => void,
  createNewResource: () => gdResource,
};


const NFTDetailPage = ({ nft, onClose}) => {
  const external_url = 'https://gateway.pinata.cloud/';
  return (
    <div>
      <h2>NFT Detail Page</h2>
      <p>NFT Name: {nft.name}</p>
      <p>NFT Description: {nft.description}</p>
      <p>NFT Image: <img src={external_url + nft.image} alt={nft.name} /></p>
      {/* <button onClick={() => setInputValue(external_url + nft.image)}>Add to Scene</button> */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};



export default NFTDetailPage;