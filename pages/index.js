function Home({ bean }) {

  return (
    <div className="grid grid-cols-1">
      <div className="mx-auto my-auto font-bold text-2xl mt-12">
        <h1>The Bean Counter</h1>
        <h2 className="text-xl">Bean of the day for { bean.BeanDate}</h2>
        <ul className="text-lg">
          <li>Name: {bean.Name}</li>
          <li>Colour: {bean.Colour}</li>
          <li>Aroma: {bean.Aroma}</li>
          <li>Cost: {bean.Name}</li>
        </ul>
      </div>
    </div>
  )
}

Home.getInitialProps = async(ctx) => {
  const res = await fetch('http://localhost:3000/api/gettodaysbean')
  const json = await res.json()
  return { bean: json }
}

export default Home
