import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
  
function Home({ bean }) {

  return (
    <>
      <div className="h-20 bg-gray-100 w-full text-center text-3xl p-4 text-green-700">The Bean Counter</div>
      <div className="grid grid-cols-1 bg-gray-100 p-12 mx-auto w-1/3 rounded-xl mt-12 text-red-700">
        <div className="mx-auto my-auto text-2xl grid grid-cols-2">
          <h2 className="text-xl font-bold py-2 col-span-2 mb-4">Bean of the day for {bean.BeanDate}</h2>
          <FontAwesomeIcon icon={faCoffee} size="4x" className="" />
          <ul className="text-lg">
            <li>Name: {bean.Name}</li>
            <li>Colour: {bean.Colour}</li>
            <li>Aroma: {bean.Aroma}</li>
            <li>Cost: £{bean.Cost}</li>
          </ul>
        </div>
      </div>
    </>
  )
}

Home.getInitialProps = async(ctx) => {
  const res = await fetch(process.env.API_URL + 'gettodaysbean')
  const json = await res.json()
  return { bean: json }
}

export default Home
