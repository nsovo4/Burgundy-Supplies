document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("buy-now").addEventListener("click", function() {
        // Create or get existing cart
        let cart = [];
        try {
            const existingCart = localStorage.getItem('cart');
            cart = existingCart ? JSON.parse(existingCart) : [];
        } catch (e) {
            console.error('Error parsing cart:', e);
            cart = [];
        }
        
        // Create the product object with the correct image path
        const product = {
            id: 1,
            name: "Wild Yam Cream",
            description: "A lightweight, nourishing cream designed to support hormonal balance and skin health.",
            price: Number(499.99),
            quantity: 1,
            image: "Mock.jpg"
        };

        // Check if product already exists in cart
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingProductIndex !== -1) {
            // If product exists, increment quantity
            cart[existingProductIndex].quantity += 1;
        } else {
            // If product doesn't exist, add it to cart
            cart.push(product);
        }
        
        // Save cart to localStorage
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart saved:', cart);
            window.location.href = "cart.html";
        } catch (error) {
            console.error('Error saving cart:', error);
            alert('There was an error adding the item to your cart. Please try again.');
        }
    });
});