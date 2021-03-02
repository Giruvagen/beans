import { createMocks } from 'node-mocks-http';
import signup from '../pages/api/signup'
import beanDB from 'faunadb'

const dbClient = new beanDB.Client({ secret: process.env.FKEY })
const q = beanDB.query

describe('/api/signup passing', () => {
    test('Validates email/pass combination can be used to sign up for a new admin account', async () =>
    {
        const randEmail = Math.floor(Math.random() * 100)
        
        const randEmailString = `${randEmail}@mailinator.com`

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                email: randEmailString,
                password: "password"
            }
        })

        await signup(req, res)

        expect(res._getStatusCode()).toBe(200)

    })
})

