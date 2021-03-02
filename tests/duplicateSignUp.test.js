import { createMocks } from 'node-mocks-http';
import signup from '../pages/api/signup'

describe('/api/signup fails', () => {
    test('Validates an exiting user cannot be signed up again', async () =>
    {

        const { req, res } = createMocks({
            method: 'POST',
            body: {
                email: "newperson7@gmail.com",
                password: "password"
            }
        })

        await signup(req, res)

        expect(res._getStatusCode()).toBe(400)

    })
})