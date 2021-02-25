var beanDB = require('faunadb')
var crypto = require('crypto')

const dbClient = new beanDB.Client({ secret: process.env.FKEY })
const q = beanDB.query

export default async (req, res) => {
    const body = req.body
    try {
            dbClient.query(
            q.Get(
                q.Match(q.Index('emailused'), body.email)
            )
        ).then(result => {
            res.status(400).json({ error: 'User Already Exists' })
            return
        })
    } catch (e) {
        console.log(e)
    }

    var userCreated = null;


    var salt = getPassSalt()
    var hashedPass = getPassHash(body.password, salt)

    body.password = hashedPass.hashPass
    body.salt = hashedPass.salt

    try {
        userCreated = await dbClient.query(
            q.Create(
                q.Collection('users'),
                {
                    data: body   
                }
            )
        )
    } catch {
        userCreated = false
    }
    if (!userCreated) {
        res.status(500).json({ error: 'Unable to Create User' })
        return
    } else {
        res.status(200).json({ message: 'User Created Successfully' })
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