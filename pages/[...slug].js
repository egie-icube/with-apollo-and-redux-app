import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import { withApollo } from '../lib/apollo'
import qgl from 'graphql-tag'
import Category from '../components/Category'
import Product from '../components/Product'

const QUERY_RESOLVER = qgl`
query getResolver($url: String!) {
  urlResolver(url: $url) {
    id
    redirectCode
    relative_url
    type
  }
}`

const GetFirstSlug = (slug) => {
  return slug[0]
}

const ReplaceString = (text, oldString, newString) => {
  return text.replace(oldString, newString)
}

const RenderResolverType = ({ type, id, url_key }) => {
  switch(type){
    case 'CATEGORY':
      return <Category ids={id} />
    case 'PRODUCT':
      return <Product url_key={url_key} />
  }
} 

const RenderResolver = ({ slug }) => {
  let url = GetFirstSlug(slug)
  if(slug.length > 1)
    url = `${slug[0]}/${slug[1]}`
  const { loading, data } = useQuery(QUERY_RESOLVER, { variables: { url } })
  if(loading){
    return <div>loading</div>
  }
  return <RenderResolverType
    id={data.urlResolver.id}
    type={data.urlResolver.type}
    url_key={ReplaceString(data.urlResolver.relative_url, '.html', '')} />
}

const UrlResolver = () => {
  const router = useRouter()
  const { slug } = router.query

  return (
    <RenderResolver slug={slug} />
  )
}

export default withApollo(UrlResolver)