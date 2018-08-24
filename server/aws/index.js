import AWS from 'aws-sdk'
// import config from '../../aws.config.json'

let config = {}
AWS.config.s3 = config
const s3 = new AWS.S3()
const signedURL = Key => new Promise((resolve, reject) => {
  const params = {
    Key,
    Bucket: 'qdca-generated-content',
  }
  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      return reject(err)
    }
    return resolve(url)
  })
})

export default signedURL
