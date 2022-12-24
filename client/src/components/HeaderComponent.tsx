import { Box, Button, Flex } from '@chakra-ui/react'
import React from 'react'
import { AiFillBell, AiOutlineShoppingCart } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Headeruser = () => {
    let navigate = useNavigate();
    let userType = localStorage.getItem('userType');
    const logoutButton = () => {

        localStorage.removeItem("token");
        console.log("logout");
        navigate("/login", { replace: true });
    }

    return (
        <Flex justifyContent={'space-between'} alignItems='center' gap='20px'>
            <Box color={'white'} transition='ease-in-out .2s' _hover={{ color: 'cyan', transform: "scale(1.1)" }}
                onClick={() => navigate("/cart", { replace: true })}>
                <AiOutlineShoppingCart size={'30px'} />
            </Box>
            <Box color={'blue'} transition='ease-in-out .2s' _hover={{ color: 'white', transform: "scale(1.1)" }}
                onClick={() => { navigate('/profile', { replace: true }) }}
            >
                <BsPersonCircle size={'30px'} />
            </Box>
            <Box color={'green.500'} transition='ease-in-out .2s' _hover={{ color: 'white', transform: "scale(1.1)" }}
                onClick={() => { navigate('/notification', { replace: true }) }}
            >
                <AiFillBell size={'30px'} />
            </Box>
            <Button bgColor={'red'}
                onClick={logoutButton}
                _hover={{
                    bgColor: 'red.400',
                    transform: 'scale(1.2)'
                }}>Logout</Button>
            {
                userType === 'admin' &&
                <Button bgColor={'green'}
                    onClick={logoutButton}
                    _hover={{
                        bgColor: 'green.500',
                        transform: 'scale(1.1)'
                    }}> Add Product</Button>
            }
        </Flex >
    )
}

export default Headeruser