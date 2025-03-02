
import './App.css'
import { Provider } from 'react-redux'
import store from './redux/store'
import ProductList from './components/ProductList'
import monk from '../src/assets/monk .png'
import { Helmet } from "react-helmet";


function App() {
  

  return (
   <>
   <Helmet>
        <title>Monk Upsell & Cross-sell</title>
        <meta name="description" content="Boost your sales with Monk Upsell & Cross-sell solutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={monk} />
      </Helmet>
    <Provider store={store}>
    <div className="mx-0"> 
     <div className='flex flex-row items-center gap-2 absolute left-4 top-2'>
      <img src={monk} alt="monk" className='w-5 h-5 '></img>
      <p className='text-sm text-gray-600'>Monk Upsell & Cross-sell</p>
     </div>
     <div className='border-b border-gray-400 w-screen absolute left-0 p-1'></div>
    <ProductList/>
    </div>
    </Provider>
   </>
  )
}

export default App
