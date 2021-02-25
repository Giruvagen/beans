var beanDB = require("faunadb");

const dbClient = new beanDB.Client({ secret: process.env.FKEY });
const q = beanDB.query;

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      var data = null;
      try {
        data = await dbClient.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection("beans"))),
            q.Lambda((x) => q.Get(x))
          )
        );
      } catch (e) {
        console.log(e);
        res.status(500).json({ Error: "No Beans Found" });
        return;
      }
      console.log(data);
      if (data) {
        res.status(200).json(data.data);
      } else {
        res.status(500).json({ Error: "No Bean Found" });
      }
      break;
    case "PUT":
      var alreadyExists = null
      try {
        data = await dbClient.query(
          q.Get(
            q.Match(q.Index('beanDate'), req.body.BeanDate)
          )
        )
      } catch (e) {
      }
      if (data) {
        res.status(500).json({Error: 'Bean already exists for that date'})
      }
      try {
        dbClient.query(
          q.Create(q.Collection("beans"), {
            data: req.body,
          })
        );
        res.status(200).json({ msg: 'Bean Created' })
      } catch {
        res.status(500).json({ Error: 'Unable to save Bean' })
      }
      break;
    case "DELETE":
      break;
    default:
      res.status(500).json({ msg: "Method Not Supported" });
      break;
  }
};
