# Basic-S3

Basic S3 Is a project I have created to make the basic actions of using and interacting with S3 compatible APIs a lot easier

## Installation

Installation is simple, Just run `npm install basic-s3`

## Example Usage

```js
const Storage = require("basic-s3");

const opts = {
  s3Options: {
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey",
    endpoint: "endpointUrlHere",
    region: "optionalRegionForEndpoint"
  },
  bucketName: "bucketName"
}

const S3 = new Storage(opts);

S3.getObject("Key");
```

## Current Methods

Currently Implemented Methods

- getObject(key)
- listObjects()
- uploadToS3(key, localFile)
- deleteFromS3(key)

Additional Helper Functions

- deleteLocalFile(localFilePath)