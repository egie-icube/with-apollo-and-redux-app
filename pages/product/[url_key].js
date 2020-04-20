import React, { useState, useEffect } from 'react';
import { withApollo } from '../../lib/apollo'
import { useQuery, } from '@apollo/react-hooks'
import qgl from 'graphql-tag'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { compose } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { withRedux } from '../../lib/redux'

const QUERY_PRODUCT = qgl`
query($url_key: String!){
  products(search: "", filter: { url_key: { eq: $url_key } }) {
    items {
      id
      name
      url_key
      sku
      price_range{
        minimum_price{
          final_price{
            value
          }
        }
      }
      image{
        url,
        label
      }
      description{
        html
      }
    }
  }
}`

const useCart = () => {
  const carts = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const addToCart = (dataNewCart) => {
    const newCart = dataNewCart
    return dispatch({
      type: 'ADD_TO_CART',
      cart: newCart,
    })
  }
  return { carts, addToCart }
}

const RenderDetailProduct = ({ qty, url_key, handleQtyChange, handleAddToCart }) => {
  const { loading, data } = useQuery(QUERY_PRODUCT, { variables: { url_key } })
  if(loading){
    return <div>loading</div>
  }
  const detailProduct = data.products.items[0]
  if(detailProduct){
    return (
      <div>
        <div style={{ display: 'inline-flex' }}>
          <div style={{ width: '30%' }}>
            <div>
              <img src={detailProduct.image.url} alt={detailProduct.image.label} style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ width: '70%' }}>
            <div>
              {`(${detailProduct.sku}) ${detailProduct.name}`}
            </div>
            <div style={{ display: 'inline-flex', width: '100%' }}>
              <div style={{ width: '10%' }}>
                Price: 
              </div>
              <div>
                {`$${detailProduct.price_range.minimum_price.final_price.value}`}
              </div>
            </div>
            <div style={{ display: 'inline-flex', width: '100%' }}>
              <div style={{ width: '10%' }}>
                Qty: 
              </div>
              <div>
                <input type="number" name="points" min="1" step="1" value={qty} onChange={handleQtyChange} />
              </div>
            </div>
            <button onClick={() => handleAddToCart(detailProduct)}>
              Add to cart
            </button>
          </div>
        </div>
        <div style={{ width: '100%', padding: 20 }}>
          <div
            dangerouslySetInnerHTML={{
            __html: detailProduct.description.html || '<p>-</p>'
          }}/>
        </div>
      </div>
    )
  } else return <h1>Product Not Found</h1>
}


const DetailProduct = () => {
  const router = useRouter()
  const { url_key } = router.query
  const [qty, setQty] = useState(1)
  const { carts, addToCart } = useCart()

  const handleQtyChange = (e) => {
    setQty(e.target.value)
  }

  const handleAddToCart = (detailProduct) => {
    const newCart = updateValue(carts, {
      detailProduct,
      qty,
      totalPrice: qty * detailProduct.price_range.minimum_price.final_price.value
    })
    addToCart(newCart)
    setQty(1)
  }

  const updateValue = (oldCarts, newCartObject) => {
    let found = false
    let newCarts = []
    newCarts = oldCarts.map(cart => {
      if(cart.detailProduct.id === newCartObject.detailProduct.id){
        found = true
        return {
          ...cart,
          qty: (cart.qty +  newCartObject.qty),
          totalPrice: (cart.qty +  newCartObject.qty) * cart.detailProduct.price_range.minimum_price.final_price.value
        }
      } else return cart
    })
    if(!found){
      return [...newCarts, newCartObject]
    }
    return newCarts
  }

  return(
    <>
      <div>
        <Link href={`/`}>
          <a style={{ paddingRight: 10 }}>Home</a>
        </Link>
        <Link href={`/cart`}>
          <a>{`Cart (${carts.length})`}</a>
        </Link>
      </div>
      <RenderDetailProduct qty={qty} url_key={url_key} handleQtyChange={handleQtyChange} handleAddToCart={handleAddToCart} />
    </>
  )
}

export default compose(withApollo, withRedux)(DetailProduct)
