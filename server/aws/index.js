import AWS from 'aws-sdk'
// import config from '../../aws.config.json'

let config = {}
AWS.config.s3 = config
// const s3 = new AWS.S3()
const s3 = new AWS.S3()
export const signedURL = Key => new Promise((resolve, reject) => {
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

export const deleteObject = Key => new Promise((resolve, reject) => {
  const params = {
    Key,
    Bucket: 'qdca-generated-content',
  }
  s3.deleteObject(params, (err, data) => {
    if (err) {
      return reject(err)
    }
    return resolve(data)
  })
})

export const addObject = (buf) => {
  const Key = 'some_test_key'
  const params = {
    Bucket: 'qdca-generated-content',
    Key,
    Body: buf,
    // ContentEncoding: 'base64',
    ContentType: 'image/png'
  }
  s3.putObject(params, (err, data) => {
    if (err) {
      console.log('da error', err)
    }
    console.log('uploaded something', params.Key, data)
  })
}
