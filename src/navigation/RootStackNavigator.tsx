import {createStackNavigator} from '@react-navigation/stack'
import * as React from 'react'

import {RootStackParamList} from '../typings/types'
import BottomTabNavigator from './BottomTabNavigator'

const {Navigator, Screen} = createStackNavigator<RootStackParamList>()

const RootNavigator = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name="Root" component={BottomTabNavigator} />
    </Navigator>
  )
}

export default RootNavigator
