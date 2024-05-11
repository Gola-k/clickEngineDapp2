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

const gd: libGDevelop = global.gd;
type ResourceStoreChooserProps = {
  options: ChooseResourceOptions,
  onChooseResources: (resources: Array<gdResource>) => void,
  createNewResource: () => gdResource,
};

const NFTDetailPage = ({ nft, onClose , createNewResource , onChooseResources}) => {
  
  const ResourceStoreChooser = ({
    options,
    onChooseResources,
    createNewResource,
  }: ResourceStoreChooserProps) => {
    return (
      // Gola-Import: ResourceStore
      <ResourceStore
        onChoose={resource => {
          const chosenResourceUrl = resource.url;
          const newResource = createNewResource();
          newResource.setFile(chosenResourceUrl);
          const resourceCleanedName = isPublicAssetResourceUrl(chosenResourceUrl)
            ? extractDecodedFilenameWithExtensionFromPublicAssetResourceUrl(
                chosenResourceUrl
              )
            : path.basename(chosenResourceUrl);
          newResource.setName(resourceCleanedName);
          newResource.setOrigin('gdevelop-asset-store', chosenResourceUrl);
  
          onChooseResources([newResource]);
        }}
        resourceKind={options.resourceKind}
      />
    );
  };
  
  const external_url = 'https://gateway.pinata.cloud/';

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [urlsErroredBooleanArray, setUrlsErroredBooleanArray] = useState([]);

  const hasErroredUrls = !!urlsErroredBooleanArray.filter(Boolean).length;

  const validateInputValue = useDebounce(async (inputValue) => {
    const urls = inputValue.split('\n').filter(Boolean);
    setError(null);
    setUrlsErroredBooleanArray([]);
    try {
      const responses = await Promise.all(
        urls.map(async (url) => {
          return await axios.get(url, {
            timeout: 1000,
            validateStatus: (status) => true,
          });
        })
      );

      setUrlsErroredBooleanArray(
        responses.map((response) => !(response.status >= 200 && response.status < 400))
      );
    } catch (error) {
      setError(error);
    }
  }, 500);

  return (
    <div>
      <h2>NFT Detail Page</h2>
      <p>NFT Name: {nft.name}</p>
      <p>NFT Description: {nft.description}</p>
      {/* <p>NFT Image: <img src={external_url + nft.image} alt={nft.name} /></p> */}
      <ColumnStackLayout noMargin expand>
        <Line noMargin>
          <TextFieldWithButtonLayout
            renderButton={(style) => (
              <RaisedButton
                onClick={() => {
                  const newResource = createNewResource();
                  newResource.setFile(inputValue);
                  newResource.setName(path.basename(inputValue));
                  newResource.setOrigin('url', inputValue);
                  onChooseResources([newResource]);
                }}
                primary
                label={<Trans>Choose</Trans>}
                style={style}
                disabled={!!error || hasErroredUrls}
              />
            )}
            renderTextField={() => (
              <SemiControlledTextField
                floatingLabelText={<Trans>Resource URL</Trans>}
                value={inputValue}
                onChange={setInputValue}
                fullWidth
                errorText={
                  error ? (
                    <Trans>
                      There was an error verifying the URL(s). Please check they are correct.
                    </Trans>
                  ) : hasErroredUrls ? (
                    <Trans>
                      Unable to verify URLs{' '}
                      {urlsErroredBooleanArray
                        .map((isErrored, index) => isErrored ? `#${index + 1}` : null)
                        .filter(Boolean)
                        .join(', ')}
                      . Please check they are correct.
                    </Trans>
                  ) : null
                }
              />
            )}
          />
        </Line>
      </ColumnStackLayout>
      <AlertMessage kind="warning">
        <Trans>
          The URL must be public and stay accessible while you work on this project. It won't be stored inside the project file.
          When exporting a game, the resource pointed by this URL will be downloaded and stored inside the game.
        </Trans>
      </AlertMessage>
      <button onClick={() => setInputValue(external_url + nft.image)}>Add to Scene</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default NFTDetailPage;