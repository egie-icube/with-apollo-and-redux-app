import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { withRedux } from '../lib/redux'


const useCart = () => {
  const carts = useSelector(state => state.cart)
  return { carts }
}

const RenderCarts = ({ carts, handleQtyChange }) => {
  if (carts){
    if(carts.length > 0 ){
      return carts.map((cart) => {
        return (
          <div key={cart.detailProduct.id} style={{ display: 'inline-flex', width: '100%' }}>
            <div style={{ paddingRight: 8 }}>
              {`(${cart.detailProduct.sku}) ${cart.detailProduct.name}`}
            </div>
            <div style={{ paddingRight: 8 }}>
              {`$${cart.detailProduct.price_range.minimum_price.final_price.value}`}
            </div>
            <div style={{ paddingRight: 8 }}>
              <input type="number" name="points" min="1" step="1" value={cart.qty} onChange={handleQtyChange} />
              <button style={{ marginLeft: 4 }}>update cart</button>
            </div>
            <div>
              {`$${cart.totalPrice}`}
            </div>
          </div>
        )
      })
    } else return ( <p>your cart is empty, please add to cart a product.</p> )
  } else return null
}

const Cart = () => {
  const { carts } = useCart()
  const handleQtyChange = () => {
    console.log('HANDLE update qty')
  }
  return(
    <>
      <div>
        <Link href={`/`}>
          <a style={{ paddingRight: 10 }}>Home</a>
        </Link>
      </div>
      <h1>Cart</h1>
      <RenderCarts carts={carts} handleQtyChange={handleQtyChange} />
    </>
  )
}

export default withRedux(Cart)
