import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {createStackNavigator} from '@react-navigation/stack'
import * as React from 'react'
// import {CartIcon} from '../assets/icons/Cart'

import {BottomTabParamList} from '../typings/types'
import CartStackNavigator from './CartStackNavigator'

const {Navigator, Screen} = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = () => {
  return (
    <Navigator initialRouteName="Cart">
      <Screen
        name="Cart"
        component={CartStackNavigator}
        options={
          {
            // tabBarIcon: () => <CartIcon />,
          }
        }
      />
    </Navigator>
  )
}

export default BottomTabNavigator
