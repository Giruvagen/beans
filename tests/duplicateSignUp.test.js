import { createMocks } from 'node-mocks-http';
import signup from '../pages/api/signup'
import beanDB from 'faunadb'

const dbClient = new beanDB.Client({ secret: process.env.FKEY })
const q = beanDB.query

describe('/api/signup fails', () => {
    test('Validates an exiting user cannot be signed up again', async () =>
    {

        try {
            try {
                const toDelete = await dbClient.query(
            q.Map(q.Paginate(q.Documents(q.Collection('users')), { size: 9999 }),
                    q.Lambda(
                    ['ref'],
                    q.Delete(q.Var('ref'))
                    )
                ))
            } catch (e) {
                console.log(e)
            }
        } catch (e) {
            console.log(e)
        }

        const randEmail = Math.floor(Math.random() * 1000)
        
        const randEmailString = `${randEmail}@mailinator.com`

        let { req, res } = createMocks({
            method: 'POST',
            body: {
                email: randEmailString,
                password: "password"
            }
        })

        let copyRes = { ...res }
        let copyReq = { ...req }

        await signup(req, res)

        expect(res._getStatusCode()).toBe(200)

        await signup(copyReq, copyRes)

        expect(copyRes._getStatusCode()).toBe(400)

    })
})