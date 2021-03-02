import e from 'cors'

var beanDB = require('faunadb')
var crypto = require('crypto')

const dbClient = new beanDB.Client({ secret: process.env.FKEY })
const q = beanDB.query

export default async (req, res) => {

    var salt = getPassSalt()
    var hashedPass = getPassHash(req.body.password, salt)

    req.body.password = hashedPass.hashPass
    req.body.salt = hashedPass.salt

    try {
        await dbClient.query(
            q.Create(
                q.Collection('users'),
                {
                    data: req.body
                }
            )
        )
        res.status(200).json({ message: 'User Created Successfully' })
        return
    } catch (e) {
        console.log(e)
          if (e.message === "instance not unique") {
              res.status(400).json({ error: 'User Already Exists' })
              return
          }
          res.status(500).json({ error: 'Unable to Create User' })
          return
    }
}

let getPassSalt = () => {
    return crypto.randomBytes(Math.ceil(12 / 2)).toString('hex').slice(0, 12)
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