import React, { useState } from "react";
import { cartItem } from "../schema/schema";
export const CartContext = React.createContext({})
// interface ICart {
//     cartItems: Number,
//     quanity: Number
// }

const CartProvider = ({ children }: any) => {
    const [cartItems, setCartItems] = useState<cartItem[]>([]);
    let AddItem = (item: cartItem) => {
        setCartItems([...cartItems, item])
        console.log(cartItems);
    }
    let cartQuanity = (items: cartItem[]) => {
        setCartItems(items);
    }
    return (
        <CartContext.Provider value={{ cartItems, AddItem, cartQuanity }}>
            {children}
        </CartContext.Provider>
    )
};
export default CartProvider;
