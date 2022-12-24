import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import Headeruser from '../components/HeaderComponent'
import ProductsList from '../components/ProductList'

const FoodPage = () => {
    return (
        <Flex direction={'column'} alignItems='center' background='rgb(26, 26, 26)' color='white' minHeight={'100vh'} w='100%'>
            <Flex alignItems={'center'} justifyContent='space-between'
                p='10px 50px'
                w='100%'>
                <Text fontSize={'4xl'} fontWeight='bold'>
                    Products
                </Text>
                <Headeruser />
            </Flex>
            {/* <ProductsList /> */}
        </Flex>
    )
}

export default FoodPage