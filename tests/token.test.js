import { createMocks } from 'node-mocks-http';
import token from '../pages/api/token'
import login from '../pages/api/login'

describe('/api/token', () => {
    test('Validates a token created through login', async () =>
    {
        let { req, res } = createMocks({
            method: 'POST',
            body: {
                email: "newperson7@gmail.com",
                password: "password"
            }
        })

        await login(req, res)

        const logres = { ...res }
        
        console.log(JSON.parse(logres._getData()))

        if (res._getStatusCode() === 200) {

            const logtoken = JSON.parse(logres._getData()).token

            console.log(logtoken)

            let { req, res } = createMocks({
                method: 'POST',
                body: { token: logtoken }
            })

            await token(req, res)
        
            console.log(res)

            expect(res._getStatusCode()).toBe(200)
        }

    })
})