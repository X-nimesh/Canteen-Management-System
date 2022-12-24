import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { Input, Button } from '@chakra-ui/react'
import { transform } from 'framer-motion'
import axios from 'axios'
import { redirect, useNavigate } from 'react-router-dom'

const Login = () => {
    // useEffect(() => {
    //     let token = localStorage.getItem("token");
    //     if (token) {
    //         navigate('/api/products');
    //     }
    // }, [])

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const submitEvent = async () => {
        // await axios.post('/login', {
        await axios.post('http://localhost:3000/login', {
            email: email,
            password: password
        }).then(res => {
            console.log(res.data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('uid', res.data.user.uid);
            localStorage.setItem('userType', res.data.user.userType);
            return navigate("/products");
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <Flex direction='column' alignItems={'center'} w='30vw' backgroundColor='#171D25' border='2px' borderColor='gray.600' borderRadius={'20px'} p='50px' gap='10px'>
            <Text fontSize='4xl' fontWeight='medium'>Login</Text>
            <Flex gap='10px' flexDirection='column' w='70%'>
                <Text>Email:</Text>
                <Input size='sm' borderRadius={'5px'} onChange={(e) => setEmail(e.target.value)} />
            </Flex>
            <Flex gap='10px' flexDirection='column' w='70%'>
                <Text>Password:</Text>
                <Input size='sm' borderRadius={'5px'} type='password' onChange={(e) => setPassword(e.target.value)} />
            </Flex>
            <Button background={'blue'} _hover={
                {
                    background: 'blue.400',
                    transform: 'scale(1.1)'
                }}
                onClick={submitEvent}>
                Login
            </Button>

        </Flex >

    )
}

export default Login