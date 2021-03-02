var beanDB = require("faunadb");

const dbClient = new beanDB.Client({ secret: process.env.FKEY });
const q = beanDB.query;

export default async (req, res) => {
    var dt = new Date()
    var elapsed = dt.setSeconds(dt.getSeconds() + 900)

    var token
    try {
        token = await dbClient.query(
            q.Get(
                q.Match(q.Index('token'), req.body.token)
            )
        )
    } catch {
        res.status(400).json({Error: 'Invalid Token'})
    }

    console.log(token)

    if (token.ts + 86400 < elapsed) {
        res.status(400).json({Error: 'Expired Token'})
    } else {
        res.status(200).json({msg: 'Valid Token'})
    }
}