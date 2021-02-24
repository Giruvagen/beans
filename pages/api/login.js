var beanDB = require('faunadb')

const dbClient = new beanDB.Client({ secret: process.env.FKEY })
const q = beanDB.query

export default async (req, res) => {
  var data = null
  try {
    data = await dbClient.query(
      q.Get(
        q.Match(q.Index('beanDate'), today)
      )
    )
  } catch (e) {
    console.log(e)
    res.status(500).json('Something Went Wrong!')
    return
  }
  console.log(data)
  if (data) {
    res.status(200).json(data.data)
  } else {
    res.status(500).json({ Error: 'No Bean Found'})
  }
}