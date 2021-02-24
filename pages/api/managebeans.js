var beanDB = require('faunadb')

const dbClient = new beanDB.Client({ secret: 'fnAEC0npRrACB3R46YTLOUi1u0mpTHRrAAMUxlPe' })
const q = beanDB.query
//todo - write function to format data for fauna query
const d = new Date();
const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
const today = new String(`${ye}-${mo}-${da}`).toString()

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