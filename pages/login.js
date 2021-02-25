import { useState } from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'

function Login() {

    const router = useRouter()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')

    const loginSubmit = async () => {
        const data = {
            email: user,
            password: pass
        }
        console.log(process.env.API_URL)
        result = await axios.post(process.env.API_URL + 'login', data)
        if (result.Ok) {
            Cookies.set('beantoken', result.body.token)
            router.push('/manage')
        }
    }

    return (
        <>
            <div className="h-20 bg-gray-100 w-full text-center text-3xl p-4 text-green-700">The Bean Counter</div>
            <div className="mx-auto text-center m-12 bg-gray-100 w-1/3 rounded-lg p-4">
                <h1>Login</h1>
                <div>
                    <form className="m-4 grid grid-cols-2 gap-2 w-1/2 mx-auto" onSubmit={loginSubmit}>
                        <label htmlFor="user">Email</label>
                        <input onChange={event => setUser(event.target.value)} type="text"></input>
                        <label htmlFor="pass">Password</label>
                        <input onChange={event => setPass(event.target.value)} type="password"></input>
                        <input type="submit" value="Login" />
                    </form>
                 </div>
            </div>
        </>
    )
}

export default Login