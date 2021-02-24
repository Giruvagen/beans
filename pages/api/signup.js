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
        res.status(200).json({ message: 'User Created Successfully'})
    }
}