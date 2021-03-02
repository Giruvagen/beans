var beanDB = require('faunadb')
var crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')

const dbClient = new beanDB.Client({ secret: process.env.FKEY })
const q = beanDB.query

import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
    origin: "*"
  })
)

export default async (req, res) => {
  console.log('p')
  await cors(req, res)
  console.log('h')
  var data = null
  try {
    data = await dbClient.query(
      q.Get(
        q.Match(q.Index('emailused'), req.body.email)
      )
    )
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: 'User Not Found'})
    return
  }
  console.log(data)
  if (data) {
    var passCheck = checkHash(req.body.password, data.data)
    if (passCheck) {
      const token = uuidv4()
      try {
        const createToken = await dbClient.query(
          q.Create(q.Collection('tokens'), { data: { token: token } })
        )
        res.status(200).json({ msg: 'Login successful', token: token })
      } catch {
        res.status(500).json({ msg: 'Login Failed' })
      }
    } else {
      res.status(500).json({ msg: 'Invalid Password' })
    }
  } else {
    res.status(500).json({ msg: 'Login Failed' })
  }
}

let checkHash = (password, storedHash) => {
  let hashToCheck = getPassHash(password, storedHash.salt)
  if (storedHash.password === hashToCheck.hashPass) {
    return true
  } else {
    return false
  }
}

let getPassHash = (pass, salt) => {
    let hash = crypto.createHmac('sha512', salt)
    hash.update(pass)
    let value = hash.digest('hex')
    return {
        salt: salt,
        hashPass: value
    }
}