# @metastore/react

  The official SDK for integrating react-based browser games with Metastore. 


  <a aria-label="NPM version" href="https://www.npmjs.com/package/@metastore/react">
    <img src="https://img.shields.io/npm/v/@metastore/react.svg?style=for-the-badge&labelColor=000">
  </a>
  <a aria-label="Build condition" href="https://www.npmjs.com/package/@metastore/react">
    <img alt="" src="https://img.shields.io/bundlephobia/min/@metastore/react?color=yellowgreen&style=for-the-badge&labelColor=000">
  </a>
  <a aria-label="License" href="https://github.com/MetastoreOfficial/react-sdk/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/@metastore/react.svg?style=for-the-badge&labelColor=000">
  </a>
  <a aria-label="Join the community on discord" href="https://discord.gg/M4nuhPxHaX" target="_blank" rel="noreferrer">
    <img alt="" src="https://img.shields.io/badge/-join%20the%20community-blueviolet?style=for-the-badge&labelColor=000&logo=discord&logoColor=fff">
  </a>

  
  ## Installation:

```bash
npm i @metastore/react
```

or

```bash
yarn add @metastore/react
```

or

```bash
pnpm add @metastore/react
```

## Usage :

### CloseButton Component

`CloseButton` will close the iframe when clicked. Pass your customized button as its child element, without specifying any `onclick` event.

```js
import React from 'react'
import { CloseButton } from '@metastore/react';


const Options = () => {
  return (
    <div>
        <button>Start Game</button>
        <button>Options</button>
        <CloseButton>
            <p>Close</p>
        </CloseButton>
    </div>
  )
}

export default Options
```

### useMetastoreData Hook

You can utilize the `useMetastoreData` hook to retrieve essential details, including isMetastore, isMobile, and orientation.

- The `data.isMobile` property returns a boolean value indicating whether the user is accessing the website from a mobile device or not.

- The `data.orientation` property returns either "portrait" or "landscape," representing the current orientation of the user's device.

- The `loading` property returns a boolean value indicating whether the data has been successfully fetched or not.

- The `isMetastore` property returns a boolean value indicating whether the website is being displayed within a metastore iframe or not. You can utilize this value to provide dynamic content if you are publishing the game on multiple websites.

```js
import React from 'react'
import { CloseButton, useMetastoreData } from '@metastore/react';


const Options = () => {

    const { data, loading, isMetastore } = useMetastoreData();

    if(loading) return <p>Loading...</p>

    return (
        <div>
            <button>Start Game</button>
            <button>Options</button>
            {isMetastore && (
                <>
                    <CloseButton>
                        <p>Close</p>
                    </CloseButton>
                    <p>Platform: {data?.isMobile}</p>
                    <p>Orientation: {data?.orientation}</p>
                </>
            )}
        </div>
    )
}

export default Options
```
