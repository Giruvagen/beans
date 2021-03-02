var beanDB = require("faunadb");

const dbClient = new beanDB.Client({ secret: process.env.FKEY });
const q = beanDB.query;

import Cors from 'cors'
import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST','PUT','OPTIONS'],
  })
)

export default async (req, res) => {
  await cors(req, res)
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
        await dbClient.query(
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
      try {
        await dbClient.query(
          q.Delete(q.Ref(q.Collection('beans'), action.payload.Ref))
        )
        res.status(200).json({msg: 'Bean deleted'})
      } catch (e) {
        res.status(500).json({msg: 'Unable to delete bean'})
      }
      break;
    default:
      res.status(500).json({ msg: "Method Not Supported" });
      break;
  }
};
