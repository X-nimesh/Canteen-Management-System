import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './page/Login'
import { Flex } from '@chakra-ui/react'
import FoodPage from './page/FoodPage'

function App() {

  return (
    <>
      <Flex backgroundColor='#171D25' color={'white'} justifyContent='center' alignItems={'center'} width='100vw' h='100vh'>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<FoodPage />} />

        </Routes>
      </Flex>
    </>
  )
}

export default App
