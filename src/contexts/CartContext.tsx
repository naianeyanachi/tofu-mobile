import React, {createContext, ReactNode, useContext, useState} from 'react'
import {
  addProductsToCart,
  createCartForUser,
  deleteCartById,
  getCart,
  getCartByUser,
  getCategoriesByTerm,
  getProductsByCategory,
  removeProductsFromCartByCategory,
  renameCartById,
  search,
  searchAgainBySearchId,
  searchHistoryByUser,
} from '../services/api'

interface Props {
  children: ReactNode
}

interface CartContextData {
  screen: keyof CartScreens
  normalizedCart: NormalizedCart
  categories: Category[]
  categoryProducts: Product[]
  quantity: number
  loading: boolean | undefined
  searchResult: SearchResult
  searchHistory: SearchHistory[]
  cartsList: Cart[]
  fromSearchHistory: boolean
  totalPrices: TotalPrices
  setScreen: React.Dispatch<React.SetStateAction<keyof CartScreens>>
  getCartById: () => void
  searchCategory: (term: string) => void
  getCategoryProducts: (categoryId: string) => void
  toggleProduct: (productId: string) => void
  setQuantity: React.Dispatch<React.SetStateAction<number>>
  addToCart: () => void
  searchCart: () => void
  removeItem: (categoryId: string) => void
  getUserCarts: () => void
  setCartId: React.Dispatch<React.SetStateAction<string>>
  createNewCart: (name: string) => void
  deleteCart: (cartId: string) => void
  renameCart: (cartId: string, name: string) => void
  getSearchHistory: () => void
  setScreenFromSearchHistory: (screen: keyof CartScreens) => void
  searchAgain: (searchId: string) => void
  setFromSearchHistory: React.Dispatch<React.SetStateAction<boolean>>
  setSearchId: React.Dispatch<React.SetStateAction<string>>
  getCartBySearchId: () => void
  calculatePrices: () => void
  setProductChoice: (
    market: string,
    categoryName: string,
    productName: string,
  ) => void
}

export const CartContext = createContext<CartContextData>({} as CartContextData)

export const CartProvider: React.FC<Props> = ({children}: Props) => {
  const [screen, setScreen] = useState<keyof CartScreens>('listCarts')
  const [loading, setLoading] = useState<boolean | undefined>(undefined)
  const [searchResult, setSearchResult] = useState<SearchResult>({})
  const [totalPrices, setTotalPrices] = useState<TotalPrices>({})
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [fromSearchHistory, setFromSearchHistory] = useState(false)
  const [cart, setCart] = useState<Cart>({} as Cart)
  const [normalizedCart, setNormalizedCart] = useState<NormalizedCart>({})
  const [searchId, setSearchId] = useState<string>('')
  const [cartId, setCartId] = useState('')
  const [userId, setUserId] = useState('naiane')
  const [cartsList, setCartsList] = useState<Cart[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [quantity, setQuantity] = useState(1)
  const [categoryId, setCategoryId] = useState('vYYR21VPT0X2cqlDqb9W0')
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductId[]>([])

  const setScreenFromSearchHistory = (screen: keyof CartScreens) => {
    setFromSearchHistory(true)
    setScreen(screen)
  }

  const createNewCart = async (name: string) => {
    const cartId = await createCartForUser(userId, name)
    setCartId(cartId)
  }

  const deleteCart = async (cartId: string) => {
    await deleteCartById(cartId)
    await getUserCarts()
  }

  const renameCart = async (cartId: string, name: string) => {
    await renameCartById(cartId, name)
    await getUserCarts()
  }

  const getCartById = async () => {
    const cart: Cart = await getCart(cartId)
    if (cart) {
      setCart(cart)
      NormalizeCart(cart)
    }
  }

  const getCartBySearchId = () => {
    const cart = searchHistory.find(search => search.id === searchId)!.cart
    NormalizeCart(cart)
  }

  const NormalizeCart = (cart: Cart | CartHistory) => {
    const normalizedCart: NormalizedCart = {}
    cart.cart_items.forEach(cartItem => {
      const categoryId = cartItem.product.category.id
      if (!(categoryId in normalizedCart)) {
        normalizedCart[categoryId] = {
          categoryName: cartItem.product.category.name,
          quantity: parseInt(cartItem.quantity),
          items: [],
        }
      }
      normalizedCart[categoryId].items.push({
        id: cartItem.id,
        product: cartItem.product,
      })
    })
    setNormalizedCart(normalizedCart)
  }

  const getUserCarts = async () => {
    const carts = await getCartByUser(userId)
    setCartsList(carts)
  }

  const searchCategory = async (term: string) => {
    const categories: Category[] = await getCategoriesByTerm(term)
    setCategories(categories)
  }

  const getCategoryProducts = async (categoryId: string) => {
    const products: Product[] = await getProductsByCategory(categoryId)
    setCategoryProducts(
      products.map(product => ({
        ...product,
        selected: false,
      })),
    )
    setCategoryId(categoryId)
    setQuantity(1)
    setSelectedProducts([])
  }

  const toggleProduct = (productId: string) => {
    setCategoryProducts(
      categoryProducts.map(categoryProduct => {
        if (categoryProduct.id === productId) {
          categoryProduct.selected = !categoryProduct.selected
        }
        return categoryProduct
      }),
    )
    if (!selectedProducts.some(({product_id}) => product_id === productId)) {
      selectedProducts.push({
        product_id: productId,
      })
    }
    setSelectedProducts(selectedProducts)
  }

  const addToCart = async () => {
    await addProductsToCart(cartId, categoryId, selectedProducts, quantity)
  }

  const searchCart = async () => {
    setLoading(true)
    const searchResult = await search(cart.cart_items, userId)
    setLoading(false)
    choosePrices(searchResult)
  }

  const choosePrices = (searchResult: SearchResult) => {
    for (const market in searchResult) {
      for (const category in searchResult[market]) {
        const productList = searchResult[market][category]
        const productMinPrice = productList.reduce((prev, curr) => {
          return parseFloat(prev.price) < parseFloat(curr.price) ? prev : curr
        })
        const index = productList.findIndex(
          product => product === productMinPrice,
        )
        searchResult[market][category][index].chosen = true
      }
    }
    setSearchResult(searchResult)
    calculatePrices()
  }

  const calculatePrices = () => {
    const totalPrices = {} as TotalPrices
    for (const market in searchResult) {
      let totalPrice = 0
      for (const category in searchResult[market]) {
        const product = searchResult[market][category].find(
          category => category.chosen === true,
        )
        totalPrice += parseFloat(product?.price!)
      }
      totalPrices[market] = totalPrice
    }
    setTotalPrices(totalPrices)
  }

  const setProductChoice = (
    market: string,
    categoryName: string,
    productName: string,
  ) => {
    searchResult[market][categoryName].map(product => {
      if (product.name === productName) {
        product.chosen = true
      } else {
        product.chosen = false
      }
      return product
    })
    setSearchResult(searchResult)
    calculatePrices()
  }

  const getSearchHistory = async () => {
    const searchHistory = await searchHistoryByUser(userId)
    setSearchHistory(searchHistory)
  }

  const searchAgain = async (searchId: string) => {
    setLoading(true)
    const searchResult = await searchAgainBySearchId(searchId)
    setLoading(false)
    choosePrices(searchResult)
  }

  const removeItem = async (categoryId: string) => {
    await removeProductsFromCartByCategory(cart.id, categoryId)
    await getCartById()
  }

  return (
    <CartContext.Provider
      value={{
        screen,
        normalizedCart,
        categories,
        categoryProducts,
        quantity,
        loading,
        searchResult,
        searchHistory,
        cartsList,
        fromSearchHistory,
        totalPrices,
        setScreen,
        getCartById,
        searchCategory,
        getCategoryProducts,
        toggleProduct,
        setQuantity,
        addToCart,
        searchCart,
        removeItem,
        getUserCarts,
        setCartId,
        createNewCart,
        deleteCart,
        renameCart,
        getSearchHistory,
        setScreenFromSearchHistory,
        searchAgain,
        setFromSearchHistory,
        setSearchId,
        getCartBySearchId,
        calculatePrices,
        setProductChoice,
      }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = (): CartContextData => {
  return useContext(CartContext)
}
