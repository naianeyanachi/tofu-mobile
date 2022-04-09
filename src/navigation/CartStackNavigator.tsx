import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import * as React from 'react'

import CartHeader from '../components/CartHeader'
import CartScreen from '../screens/Cart'
import {CartParamList} from '../typings/types'
import {CartProvider} from '../contexts/CartContext'

const {Navigator, Screen} = createStackNavigator<CartParamList>()

const CartStackNavigator = () => {
  return (
    <CartProvider>
      <Navigator>
        <Screen
          name="CartScreen"
          component={CartScreen}
          options={{
            // headerTitle: () => <CartHeader />,
          }}
        />
      </Navigator>
    </CartProvider>
  )
}

export default CartStackNavigator
