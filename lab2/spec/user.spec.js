const User=require("../user");

describe("Test addToCart",()=>{
    let user;

    beforeEach(() => {
        user = new User("hala", 1234);
    })
    // Test case 1: Add a product to the cart
    it("should add a product to the cart", () => {
        
        const product = { name: "phone", price: 5000 };

        user.addToCart(product);

        expect(user.cart.length).toBe(1);
        expect(user.cart[0]).toBe(product);

    });

    // Test case 2: Add multiple products to the cart
    it(" add multiple products to the cart", () => {
        
        const products = [
            { name: "oppo mobile", price: 6000 },
            { name: "samsung mobile", price: 7000},
            { name: "iphone", price: 15000 }
        ];

        products.forEach(product => user.addToCart(product));

        expect(user.cart.length).toBe(products.length);
        products.forEach((product, index) => {
            expect(user.cart[index]).toBe(product);
        });
    });

});


describe("Test calculateTotalCartPrice", () => {
    let user;

    beforeEach(() => {
        user = new User("hala", 1234);
    });

    // Test case 1: Calculate total cart price with no products
    it("return 0 when cart is empty", () => {
        
        const totalPrice = user.calculateTotalCartPrice();
        expect(totalPrice).toBe(0);
    });

    // Test case 2: Calculate total cart price with products
    it(" return the correct total price of all products in the cart", () => {

        const products = [
            { name: "oppo mobile", price: 6000 },
            { name: "samsung mobile", price: 7000},
            { name: "iphone", price: 15000 }
        ];
        products.forEach(product => user.addToCart(product));

        const totalPrice = user.calculateTotalCartPrice();

        expect(totalPrice).toBe(6000 + 7000 + 15000);
    });

 
});

describe("Test checkout", () => {
    let user;

    beforeEach(() => {
        user = new User("hala", 1234);
    });

    // Test case 1: Payment model methods should be called
    it("should call paymentModel methods", () => {
        const paymentModel = {
            goToVerifyPage: () => {},
            returnBack: () => {},
            isVerify: () => true
        };

        spyOn(paymentModel, 'goToVerifyPage');
        spyOn(paymentModel, 'returnBack');

        user.checkout(paymentModel);

        expect(paymentModel.goToVerifyPage).toHaveBeenCalled();
        expect(paymentModel.returnBack).toHaveBeenCalled();
    });

    // Test case 2: Should return true if the payment is verified
    it("should return true if the payment is verified", () => {

        const paymentModel = {
            goToVerifyPage() {},
            returnBack() {},
            isVerify: () => true
        };

        const result = user.checkout(paymentModel);

        expect(result).toBe(true);
    });

    
});

