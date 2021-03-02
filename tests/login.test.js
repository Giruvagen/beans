import { createMocks } from 'node-mocks-http';
import login from '../pages/api/login'
import beanDB from 'faunadb'
import signup from '../pages/api/signup'

const dbClient = new beanDB.Client({ secret: process.env.FKEY })
const q = beanDB.query

describe('/api/login', () => {
    test('Validates email/pass combination against store users and returns a token', async () =>
    {

        try {
            await dbClient.query(
                q.Map(q.Paginate(q.Documents(q.Collection('users')), { size: 9999 }),
                    q.Lambda(
                    ['ref'],
                    q.Delete(q.Var('ref'))
                    )
                ))
        } catch (e) {
            console.log(e)
        }

        
        let { req, res } = createMocks({
            method: 'POST',
            body: {
                email: "newperson7@mailinator.com",
                password: "password"
            }
        })

        const logRes = { ...res }
        const logReq = { ...req }

        await signup(req, res)

        expect(res._getStatusCode()).toBe(200)

        await login(logReq, logRes)

        expect(logRes._getStatusCode()).toBe(200)
        expect(JSON.parse(logRes._getData()).token).toHaveLength(36)

    })
})