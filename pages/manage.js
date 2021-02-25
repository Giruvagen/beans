import axios from 'axios'
import Cookies from 'js-cookie'
import { Router } from 'next/router'
function Manage() {
    return (
        <div>
            
        </div>
    )
}

Manage.getInitialProps = () => {
    const token = Cookies.get('beantoken')
    if (token) {
        const result = await axios.post(process.env.API_URL + 'token', { token: token })
        if (result.Ok) {
            return { token: true }
        } else {
            Router.push('/login')
        }
    }
}

export default Manage