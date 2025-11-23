import ScreenPage from '@/src/Components/ScreenWrapper/ScreenPage'
import { INoPropsReactComponent } from '@/src/GlobalTypes/Types'
import React from 'react'
import { Text } from 'react-native'

const Settings:INoPropsReactComponent = () => {
  return (
    <ScreenPage>
      <Text>Settings</Text>
    </ScreenPage>
  )
}

export default Settings