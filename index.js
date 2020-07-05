const aws = require('aws-sdk');
const fs = require(`fs`);

class Storage {

  /**
   *Creates an instance of Storage.
   * @param {Class} app The Instance of the App that is running
   * @param {Object} [cdnOpts={}] The auth.cdnOptions Object with all configured options included.
   * @memberof Storage
   */
  constructor(cdnOpts = {}) {
    this.opts = cdnOpts;
    this.credentials = new aws.Credentials(this.opts.s3Options.accessKeyId, this.opts.s3Options.secretAccessKey);
    this.client = new aws.S3({ credentials: this.credentials, endpoint: this.opts.s3Options.endpoint });
    this.debug = cdnOpts.debug ? true : false;
    if(this.debug) console.log(`S3 => Client Initialized, Connected to ${this.opts.s3Options.endpoint}/${this.opts.bucketName}`);
  }

  /**
 * Uploads a file to the s3 bucket
 * @param {String} localFile Path to local file
 * @param {String} key       Path on S3 that it should be uploaded to
 */
  uploadToS3(key, item) {
    return new Promise((resolve, reject) => {
      var timeStart = Date.now();
      let params = {
        Bucket: this.opts.bucketName,
        ACL: "public-read",
        Key: key,
        Body: item.Body,
        ContentType: item.ContentType
      };
      let uploader = this.client.putObject(params, (err, data) => {
        if (err) return resolve(console.error(err));
        if(this.debug) console.log(`B2 => Uploaded file ${key} to CDN in ${Date.now() - timeStart}ms`);
        resolve(key);
      });
    });
  }

  /**
   * Removes any given file from S3
   * @param {String} key The file name on S3
   */
  deleteFromS3(key) {
    return new Promise((resolve, reject) => {
      let timeStart = Date.now();
      let params = {
        Bucket: this.opts.bucketName,
        Delete: {
          Objects: [
            { Key: key }
          ]
        },
        quiet: false
      };
      let remove = this.client.deleteObjects(params);
      remove.on(`end`, () => {
        if(this.debug) console.log(`CDN => Removed file ${key} from CDN`);
        resolve();
      });
    });
  }

  getObject(key) {
    return new Promise((resolve, reject) => {
      let params = {
        Bucket: this.opts.bucketName,
        Key: key
      };
      let obj = this.client.getObject(params, (err, data) => {
        if (err) resolve(false);
        resolve(data);
      });
    });
  }

  listObjects() {
    return new Promise((resolve, reject) => {
      let items = this.client.listObjectsV2({ Bucket: this.opts.bucketName, MaxKeys: 100 }, (err, data) => {
        if (err) return console.error(err);
        return resolve(data.Contents);
      });
    });
  }

  /**
   * Remove any given file from the Local system
   * @param {String} localFile The path to the local File
   */
  deleteLocalFile(localFile) {
    fs.unlink(localFile, (err) => {
      if (err) return console.error(err);
      return true;
    });
  }
};

module.exports = Storage;