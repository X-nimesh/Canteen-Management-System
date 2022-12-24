import { Button, Flex, Text } from '@chakra-ui/react'
import axios from 'axios'
import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../context/CartContext'
import { cartItem } from '../schema/schema'

interface IProduct {
    pId: number,
    name: String,
    details: String,
    price: Number
}
const ProductsList = () => {
    let [product, setProduct] = useState<IProduct[]>([{ pId: 1, name: 'product', details: "details", price: 0 }])
    let { cartItems, AddItem } = useContext<any>(CartContext);
    const getProducts = async () => {
        await axios.get('http://localhost:3000/product').then(res => {
            // console.log(res.data.productlist)
            setProduct(res.data.productlist)
        })

        // fetch('http://localhost:3000/product').then(res => res.json()).then(data => {
        //     console.log(data)
        // })

    }
    const addItemCart = (prod: IProduct) => {
        let addNew = true;
        // AddItem(i)
        cartItems.map((item: cartItem) => {
            if (item.product.pId === prod.pId) {
                item.quantity++;
                addNew = false;
            }

        })
        addNew && AddItem({ product: prod, quantity: 1 })
        console.log(cartItems);
    }
    console.log(cartItems);
    useEffect(() => {
        getProducts()
        console.log(product);
    }, [])
    return (
        <Flex direction={'row'} w='100%' gap='20px' mt={'30px'} flexWrap={'wrap'} px='90px'>
            {product.map((item, index) => {
                console.log(item);
                return (
                    <Flex direction={'column'} key={index} maxW='30vw' maxH='40vh' minW='20vw'
                        boxShadow='dark-lg'
                        backgroundColor='whiteAlpha.100' borderRadius={'20px'} p='50px' gap='10px'
                        transition={'all 0.2s ease-in-out'}
                        _hover={{
                            transform: 'scale(1.1)'

                        }}
                    >
                        <Text fontSize={'2xl'} fontWeight='bold'>{item.name}</Text>
                        <Text>{item.details}</Text>
                        <Text color={'blue.200'}>Rs.{item.price.toString()}</Text>
                        <Button p='10px 10px' bg='blue.700' _hover={{ bg: 'blue.500' }} onClick={() => addItemCart(item)}>Add to Cart</Button>
                    </Flex>
                )
            })}
            {/* <Flex direction={'column'} alignItems='center' background={'blackAlpha.500'} p="20px" borderRadius={'10px'}>
            <Text>Item 1</Text>
            <Text>This is an awesome product</Text>
            <Text fontSize={'md'}>Rs.300</Text>
        </Flex> */}
        </Flex>
    )
}

export default ProductsList