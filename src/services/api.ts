import axios from 'axios'

const baseURL = 'https://tofu.loca.lt/'
const api = axios.create({baseURL})

export const createCartForUser = async (
  userId: string,
  cartName: string,
): Promise<string> => {
  const body = {
    user_id: userId,
    name: cartName,
  }
  const {data} = await api.post<CartId>(`cart`, body)
  console.log(data)
  const {id} = data
  return id
}

export const deleteCartById = async (cartId: string): Promise<string> => {
  const {data} = await api.delete<string>(`cart/${cartId}`)
  console.log(data)
  return data
}

export const renameCartById = async (
  cartId: string,
  name: string,
): Promise<string> => {
  const body = {
    name: name,
  }
  const {data} = await api.put<string>(`cart/${cartId}`, body)
  console.log(data)
  return data
}

export const getCart = async (cartId: string): Promise<Cart> => {
  const {data} = await api.get<Cart>(`cart/${cartId}`)
  console.log(data)
  return data
}

export const getCartByUser = async (userId: string): Promise<Cart[]> => {
  const {data} = await api.get<Cart[]>(`user/${userId}/carts`)
  console.log(data)
  return data
}

export const getCategoriesByTerm = async (
  term: string,
): Promise<Category[]> => {
  const {data} = await api.get<Category[]>(`categories/${term}`)
  console.log(data)
  return data
}

export const getProductsByCategory = async (
  categoryId: string,
): Promise<Product[]> => {
  const {data} = await api.get<Product[]>(`category/${categoryId}/products`)
  console.log(data)
  return data
}

export const addProductsToCart = async (
  cartId: string,
  categoryId: string,
  productIds: ProductId[],
  quantity: number,
): Promise<string> => {
  const body = {
    product_ids: productIds,
    category_id: categoryId,
    quantity: quantity,
  }
  const {data} = await api.post<string>(`cart/${cartId}/products`, body)
  console.log(data)
  return data
}

export const removeProductsFromCartByCategory = async (
  cartId: string,
  categoryId: string,
): Promise<string> => {
  const config = {
    data: {
      category_id: categoryId,
    },
  }
  const {data} = await api.delete<string>(`cart/${cartId}/category`, config)
  console.log(data)
  return data
}

export const removeAllProductsFromCart = async (
  cartId: string,
): Promise<string> => {
  const {data} = await api.delete<string>(`cart/${cartId}/products`)
  console.log(data)
  return data
}

export const search = async (
  cartItems: CartItem[],
  userId: string,
): Promise<SearchResult> => {
  const body = {
    user_id: userId,
    cart_items: cartItems,
  }
  const {data} = await api.post<SearchResult>('search', body)
  console.log(data)
  return data
}

export const searchAgainBySearchId = async (
  searchId: string,
): Promise<SearchResult> => {
  const {data} = await api.post<SearchResult>(`search/${searchId}`)
  console.log(data)
  return data
}

export const searchHistoryByUser = async (
  userId: string,
): Promise<SearchHistory[]> => {
  const {data} = await api.get<SearchHistory[]>(`user/${userId}/history`)
  console.log(data)
  return data
}
