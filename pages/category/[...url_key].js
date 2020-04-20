import React, { useState, useEffect } from 'react';
import { withApollo } from '../../lib/apollo'
import { useQuery } from '@apollo/react-hooks'
import qgl from 'graphql-tag'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { compose } from 'redux'
import { useSelector } from 'react-redux'
import { withRedux } from '../../lib/redux'

const QUERY_CATEGORY_DETAIL = qgl`
query($url_key: String!) {
  categoryList(filters: { url_key: { eq: $url_key } }) {
    id
    name
    url_key
    description
  }
}
`

const QUERY_PRODUCTS = qgl`
query($cid: String!){
  products(search: "", filter: { category_id: { eq: $cid } }) {
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
    }
  }
}`

const useCart = () => {
  const carts = useSelector(state => state.cart)
  return { carts }
}

const RenderProduct = ({ cid }) => {
  if(cid){
    const { loading, data } = useQuery(QUERY_PRODUCTS, { variables: { cid } })
    if(loading) return <div style={{ textAlign: 'center' }}>loading</div>
    if(data && data.products.items.length > 0){
      return(
        <div>
          {
            data.products.items.map((product) => {
              return(
                <Link key={product.id}  href={`/product/${product.url_key}`}>
                  <div style={{ textAlign: 'center', width: '10%', height: 350, display: 'inline-block' }}>
                    <div>
                      <img src={product.image.url} alt={product.image.label} style={{ width: '100%' }} />
                    </div>
                    <div>
                      {`(${product.name}) ${product.name}`}
                    </div>
                    <div>
                      {`$${product.price_range.minimum_price.final_price.value}`}
                    </div>
                  </div>
                </Link>
              )
            })
          } 
        </div>
      )
    } else return <h1 style={{ textAlign: 'center' }}>Product not found</h1>
  }
  else return <div style={{ textAlign: 'center' }}>loading</div>
}

const RenderHeadCategory = ({ detailCategory }) => {
  if(detailCategory){
    return(
      <>
        <h1>Category {detailCategory.name}</h1>
        
        <h4>Desc: <div
            dangerouslySetInnerHTML={{
            __html: detailCategory.description || '<p>-</p>'
          }}/></h4>
      </>
    )
  } else return null
}

const RenderCategory = ({ url_key }) => {
  const { loading, data, error } = useQuery(QUERY_CATEGORY_DETAIL, { variables: { url_key: url_key[url_key.length-1] } })
  if(loading)return <div>loading</div>
  if(error || data.categoryList.length === 0) return <div>Category Not Found</div>
  const detailCategory = data.categoryList[data.categoryList.length-1]
  return (
    <div>
      <RenderHeadCategory detailCategory={detailCategory} />
      <RenderProduct cid={detailCategory && detailCategory.id} />
    </div>
  )
}

const DetailCategory = () => {
  const router = useRouter()
  const { url_key } = router.query
  const { carts } = useCart()

  return(
    <div>
      <div>
        <Link href={`/`}>
          <a style={{ paddingRight: 10 }}>Home</a>
        </Link>
        <Link href={`/cart`}>
          <a>{`Cart (${carts.length})`}</a>
        </Link>
      </div>
      <RenderCategory url_key={url_key} />
    </div>
  )
}

export default compose(withApollo, withRedux)(DetailCategory)
