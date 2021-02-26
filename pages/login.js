import { useState } from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import e from 'cors'

function Login() {

    const router = useRouter()
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const[loginError, setLoginError] = useState('')

    const loginSubmit = async (e) => {
        e.preventDefault()
        const data = {
            email: user,
            password: pass
        }
        try {
            const result = await axios.post(process.env.API_URL + 'login', data)
            Cookies.set('beantoken', result.data.token)
            router.push('/manage')
        } catch (e) {
            setLoginError('Login failed.')
        }
    }

    return (
        <>
            <div className="h-20 bg-gray-100 w-full text-center text-3xl p-4 text-green-700">The Bean Counter</div>
            <div className="mx-auto text-center m-12 bg-gray-100 w-2/3 rounded-xl p-2">
                <h1>Login</h1>
                <div>
                    <form className="text-left m-4 p-4 grid grid-cols-3 gap-2 w-1/2 mx-auto" onSubmit={loginSubmit}>
                        <label htmlFor="user">Email</label>
                        <input className="col-span-2" onChange={event => setUser(event.target.value)} type="text"></input>
                        <label htmlFor="pass">Password</label>
                        <input className="col-span-2" onChange={event => setPass(event.target.value)} type="password"></input>
                        <input className="col-span-2 bg-red-700 rounded" type="submit" value="Login" />
                        <div className="col-span-2">{loginError}</div>
                    </form>
                 </div>
            </div>
        </>
    )
}

export default Login