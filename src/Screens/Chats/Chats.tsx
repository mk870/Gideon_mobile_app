import ScreenPage from '@/src/Components/ScreenWrapper/ScreenPage'
import { INoPropsReactComponent } from '@/src/GlobalTypes/Types'
import React from 'react'
import { Text } from 'react-native'

const Chats:INoPropsReactComponent = () => {
  return (
    <ScreenPage>
      <Text>Chats</Text>
    </ScreenPage>
  )
}

export default Chats