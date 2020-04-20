import { withApollo } from '../lib/apollo'
import { useQuery } from '@apollo/react-hooks'
import qgl from 'graphql-tag'
import Link from 'next/link'
import { compose } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { withRedux } from '../lib/redux'

const QUERY_CATEGORYLIST = qgl`
  {
    categoryList{
      children_count
      children {
        id
        level
        name
        path
        url_path
        url_key
        children {
          id
          level
          name
          path
          url_path
          url_key
        }
      }
    }
  }`

const useCart = () => {
  const carts = useSelector(state => state.cart)
  return { carts }
}

const Index = () => {
  const { carts } = useCart()
  const { loading, error, data, fetchMore, networkStatus } = useQuery(QUERY_CATEGORYLIST)
  if(loading){
    return <div>loading</div>
  }
  const categoryList = data.categoryList[0]
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
      <h1>Category</h1>
      <ul>
        {
          categoryList.children.map((category) => {
            return(
              <li key={category.id}>
                {/* <Link href={`/category/${category.url_key}`}> */}
                <Link href="/[...slug]" as={`/${category.url_key}.html`}>
                  <a>{category.name}</a>
                </Link>
                <ul>
                  {
                    category.children.map((categoryChildren) => {
                      return(
                        <li key={categoryChildren.id}>
                          {/* <Link href={`/category/${category.url_key}/${categoryChildren.url_key}`}> */}
                          <Link
                            href="/[...slug]"
                            as={`/${category.url_key}/${categoryChildren.url_key}.html`}>
                            <a>{categoryChildren.name}</a>
                          </Link>
                        </li>
                      )
                    })
                  }
                </ul>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

export default compose(withApollo, withRedux)(Index)
