/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {NavigationContainer} from '@react-navigation/native'
import * as React from 'react'
import {ThemeProvider} from 'styled-components'

import darkTheme from '../styles/theme/dark'
import lightTheme from '../styles/theme/light'
import RootNavigator from './RootStackNavigator'

const Navigation = () => {
  const colorScheme = 'dark'

  return (
    <NavigationContainer>
      <ThemeProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme}>
        <RootNavigator />
      </ThemeProvider>
    </NavigationContainer>
  )
}

export default Navigation
