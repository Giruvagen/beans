import { createMocks } from '../node_modules/node-mocks-http';
import gettodaysbean from '../pages/api/gettodaysbean'

describe('/api/gettodaysbean', () => {
    test('Returns the bean of today for todays date', async () =>
    {
        const { req, res } = createMocks({
            method: 'GET'
        })

        await gettodaysbean(req, res)
        
        console.log(res)

        const d = new Date();
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
        const today = new String(`${ye}-${mo}-${da}`).toString()

        expect(res._getStatusCode()).toBe(200)
        expect(JSON.parse(res._getData())).toEqual(
            expect.objectContaining({
                BeanDate: today
            })
        )
    })
})