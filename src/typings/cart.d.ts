interface User {
  id: string
  name: string
}

interface Cart {
  id: string
  user_id: string
  name: string
  cart_items: CartItem[]
}

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  category_id: string
  values: MetadataValue[]
  category: Category
  selected?: boolean
}

interface CartItem {
  id: string
  cart_id: string
  product_id: string
  quantity: string
  product: Product
}

interface NormalizedCart {
  [categoryName: string]: NormalizedCategory
}

interface NormalizedCategory {
  categoryName: string
  quantity: number
  items: NormalizedCartItem[]
}

interface NormalizedCartItem {
  id: string
  product: Product
}

interface MetadataField {
  id: string
  field: string
}

interface MetadataValue {
  id: string
  field_id: string
  product_id: string
  value: string
  field: MetadataField
}

interface ProductId {
  product_id: string
}

interface CartId {
  id: string
}

interface CartScreens {
  listCarts: JSX.Element
  addProducts: JSX.Element
  checkCart: JSX.Element
  search: JSX.Element
  searchHistory: JSX.Element
}

interface SearchResult {
  [marketName: string]: SearchCategory
}

interface SearchCategory {
  [categoryName: string]: SearchProduct[]
}

interface TotalPrices {
  [market: string]: number
}

interface SearchProduct {
  name: string
  price: string
  brand?: string
  chosen?: boolean
}

interface CartHistory {
  id: string
  cart_items: CartItem[]
}

interface SearchHistory {
  id: string
  created_at: string
  cart: CartHistory
}
