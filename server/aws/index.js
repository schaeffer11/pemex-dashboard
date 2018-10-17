import AWS from 'aws-sdk'

import config from '../../aws.config.json'

AWS.config.s3 = config

const s3 = new AWS.S3()
export const signedURL = Key => new Promise((resolve, reject) => {
  const params = {
    Key,
    Bucket: 'pemex-prod-01',
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
    Bucket: 'pemex-prod-01',
  }
  s3.deleteObject(params, (err, data) => {
    if (err) {
      return reject(err)
    }
    return resolve(data)
  })
})

export const getBuckets = () => {
  s3.listBuckets({}, (err, data) => {
    if (err) {
      console.log('something is wrong', err)
    }
    console.log('should be buckets', data)
  })
}

export const addObject = (buf, Key) => new Promise((resolve, reject) => {
  console.log('what is the key', Key)
  const params = {
    Bucket: 'pemex-prod-01',
    Key,
    Body: buf,
    // ContentEncoding: 'base64',
    ContentType: 'image/png'
  }
  console.log('da params', params)
  s3.putObject(params, (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve({ Key, data })
    }
  })
})
