import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { useEffect, useState, useReducer } from 'react'
function Manage({ token, currentBeans }) {
    
    const router = useRouter()

    const beans = { ...currentBeans }
    
    function beanReducer(state, action) {
        switch (action.type) {
            case 'add':
                return { beans: state.beans.push(action.payload) }
            case 'delete':
                return { beans: state.beans.splice(state.beans.indexOf(action.payload),1) }
            case 'update':
                return
            default:
                return { beans: state.beans }
        }
    }

    const [beanState, beanDispatch] = useReducer(beanReducer, { beans: beans })

    const [beanError, setBeanError] = useState('')
    const [beanData, setBeanData] = useState({
        BeanDate: '',
        Aroma: '',
        Name: '',
        Colour: '',
        Image: '',
        Cost: ''
    })

    useEffect(() => {
        if (!token) {
        router.push('/login')
        }
    }, [])

    const handleFieldChange = (e) => {
        const { name, value } = e.target
        setBeanData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const beanSubmit = (e) => {
        e.preventDefault()
        var hasValidationError = false
        Object.entries(beanData).forEach(d => {
            console.log(d[1])
            if (d[1].length < 1) {
                setBeanError(d[0].toString() + ' must have a valid value')
                hasValidationError = true
                return
            }
        })
        if (!hasValidationError) {
            try {
                axios.put(process.env.API_URL + 'managebeans', beanData)
            } catch (err) {
                setBeanError('Unable to save bean')
            }
        }
        beanDispatch({ type: 'add', payload: beanData})
    }

    const beanDelete = async (bean) => {
        console.log(bean)
        try {
            await axios.delete(process.env.API_URL + 'managebeans', { beanId: bean.ref.id })
            beanDispatch({ type: 'delete', payload: bean })
        } catch (err) {
            setBeanError('Unable to save bean')
        }
    }


    return (
        <div>
            <div className="h-20 bg-gray-100 w-full text-center text-3xl p-4 text-green-700">The Bean Counter</div>
            <div className="mx-auto text-center m-12 bg-gray-100 w-2/3 rounded-xl p-2">
                <h1>Add Daily Beans</h1>
                <div>
                    <form className="text-left m-4 p-4 grid grid-cols-3 gap-2 w-1/2 mx-auto" onSubmit={beanSubmit}>
                        <label htmlFor="user">Date</label>
                        <input name="BeanDate" type="date" className="col-span-2" onChange={event => handleFieldChange}></input>
                        <label htmlFor="pass">Name</label>
                        <input name="Name" className="col-span-2" onChange={event => handleFieldChange} type="text"></input>
                        <label htmlFor="pass">Aroma</label>
                        <input name="Aroma" className="col-span-2" onChange={event => handleFieldChange} type="text"></input>
                        <label htmlFor="pass">Colour</label>
                        <input name="Colour" className="col-span-2" onChange={event => handleFieldChange} type="text"></input>
                        <label htmlFor="pass">Image</label>
                        <input name="Image" className="col-span-2" onChange={event => handleFieldChange} type="text"></input>
                        <label htmlFor="pass">Cost</label>
                        <input name="Price" className="col-span-2" onChange={event => handleFieldChange} type="text"></input>
                        <input className="col-span-2 bg-red-700 rounded" type="submit" value="Add Bean" />
                        <div className="col-span-2">{beanError}</div>
                    </form>
                 </div>
            </div>
            <h2 className="text-xl text-center">Current Beans</h2>
            {beans.data && beans.data.map(cBean => {
                return (
                  <>
                    <div className="mx-auto text-center m-12 bg-gray-100 w-2/3 rounded-xl p-2">
                            Name: {cBean.data.Name} Date: {cBean.data.BeanDate}
                            <FontAwesomeIcon value={cBean} onClick={() => beanDelete(cBean)} className="float-right mx-2 my-1" icon={faTimes} />
                    </div>
                  </>
                )
            })}
        </div>
    )
}

Manage.getInitialProps = async () => {
    var currentBeans = []
    try {
        currentBeans = await axios.get(process.env.API_URL + 'managebeans')
    } catch (e) {
        console.log(e)
    }
    const tokenCookie = Cookies.get('beantoken')
    if (tokenCookie) {
        const result = await axios.post(process.env.API_URL + 'token', { token: tokenCookie })
        if (result.status === 200) {
            return { token: true, currentBeans: currentBeans }
        } else {
            return { token: false, currentBeans: []}
        }
    } else {
        return { token: false, currentBeans: [] }
    }
}

export default Manage