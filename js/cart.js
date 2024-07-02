var totalAmount;
document.addEventListener('DOMContentLoaded', () => {
    // Fetch cart data from the server when the page loads
    var bookid = [];
    var bookname = [];
    var bookimage = [];
    fetch('/get-cart-items')
        .then(response => response.json())
        .then(data => {
            const cart_1 = document.getElementById('cart_1');
            const cart_2 = document.getElementById('cart_2');

            if (data.cart.length === 0) {
                // Cart is empty, display "empty"
                cart_1.style.width = "1295px";
                cart_1.style.marginRight = "15px";
                cart_1.style.marginLeft = "13px";
                cart_2.style.display = "none";

                var row_3 = document.createElement('div');
                row_3.setAttribute("class", "row-3");

                var image = document.createElement('img');
                image.setAttribute("class", "image");
                image.setAttribute("src", "../image/empty_cart.png");

                var h1 = document.createElement('h1');
                h1.setAttribute("class", "h1");
                h1.innerHTML = "Your cart is empty!";

                var h2 = document.createElement('h2');
                h2.setAttribute("class", "h2");
                h2.innerHTML = "It's a good day to buy items you saved for later!";

                row_3.append(image, h1, h2);
                cart_1.append(row_3);
            }
            else {
                // Loop through each item in the cart data and create HTML elements for display
                data.cart.forEach(item => {


                    var off = document.createElement('p');
                    var row_4 = document.createElement('div');
                    row_4.setAttribute("class", "row_4");
                    var ro = document.createElement('div');
                    var wo = document.createElement('div');
                    var pri = document.createElement("div");
                    pri.setAttribute("class", "pri");
                    wo.setAttribute("class", "wo");
                    var big_image = document.createElement('img');

                    big_image.setAttribute('src', 'data:image/jpeg;base64,' + item.p_image);
                    big_image.setAttribute("class", "big_img");

                    var defi = document.createElement('p');
                    defi.setAttribute("class", "defi");
                    defi.textContent = item.p_name;

                    var bid = document.createElement('p');
                    bid.setAttribute("class", "defi");
                    //bid.textContent = "pro" +  item.p_id;

                    var actual_price = document.createElement('p');
                    actual_price.setAttribute("class", "price");
                    actual_price.textContent = '₹ ' + item.p_price;

                    var deleted_price = document.createElement('del');
                    deleted_price.setAttribute("class", "deleted_price");
                    deleted_price.textContent = '₹ ' + item.p_del_price;

                    off.setAttribute("class", "of");

                    off.innerHTML = '₹ ' + (parseFloat(item.p_del_price) - parseFloat(item.p_price)) + "off";

                    var bt = document.createElement("p");
                    bt.innerHTML = "REMOVE";
                    bt.addEventListener('click', () => removeFromCart(item.p_id));
                    bt.setAttribute("class", "bt");

                    ro.append(big_image);

                    pri.append(actual_price, deleted_price, off, bt);
                    /////////////////////////////////////////////
                    wo.append(defi, bid, pri);
                    row_4.append(ro, wo);
                    cart_1.append(row_4);


                    bookid.push(` ${item.p_id}`);
                    bookname.push(`${item.p_name}`);
                    bookimage.push(`${item.p_image}`)
                });
                cartvalue(data)

                var bid_id = document.createElement('input');
                bid_id.setAttribute("class", "b_details");
                bid_id.name = 'p_id';
                bid_id.value = bookid.join(', ');
                bid_id.readOnly = true;
                var bid_name = document.createElement('input');
                bid_name.setAttribute("class", "b_details");
                bid_name.readOnly = true;
                bid_name.name = 'p_name';
                bid_name.value = bookname.join(', ');

                // Create hidden input element for p_image
                var bid_image = document.createElement('input');
                bid_image.setAttribute("type", "hidden");
                bid_image.setAttribute("name", "p_image");
                bid_image.setAttribute("value", bookimage.join(', '));
                document.getElementById('your-form-id').append(bid_id, bid_name, bid_image);

            }
        })
        .catch(error => {
            console.error('Error:', error);
        });



    document.getElementById('full').style.display = "none";

});

function removeFromCart(p_id) {
    // Send a request to remove the item with the specified p_id from the cart
    fetch('/remove-from-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ p_id })
    })
        .then(() => {
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });


}




function cartvalue(data) {
    var total = 0; // Initialize the total price
    var discount = 0; // Initialize the discount

    

    data.cart.forEach(item => {
        var itemPrice = String(item.p_price);
        var itemDiscountPrice = String(item.p_del_price);
        total += parseFloat(itemPrice.replace("₹", ""));
        discount += parseFloat(itemDiscountPrice.replace("₹", ""));

    });


    var div_1 = document.createElement('div');
    var di_1 = document.createElement('div');
    var price_item = document.createElement('h4');
    price_item.innerHTML = "Price(items)";
    var price_total = document.createElement('h5');
    price_total.textContent = '₹' + discount;
    var di_2 = document.createElement('div');
    var discount_item = document.createElement('h4');
    discount_item.innerHTML = "Discount";
    var discount_total = document.createElement('h5');
    discount_total.textContent = '-' + " " + '₹' + (discount - total);
    var di_3 = document.createElement('div');
    var del_charge = document.createElement('h4');
    del_charge.innerHTML = "Delivery Charges";
    var free_charge = document.createElement('h5');
    free_charge.innerHTML = "Free";
    di_1.append(price_item, price_total);
    di_2.append(discount_item, discount_total);
    di_3.append(del_charge, free_charge);
    div_1.append(di_1, di_2, di_3);

    div_1.setAttribute("class", "div_1");
    di_1.setAttribute("class", "di_1");
    di_2.setAttribute("class", "di_1");
    di_3.setAttribute("class", "di_1");
    price_item.setAttribute("class", "charge");
    discount_item.setAttribute("class", "charge");
    del_charge.setAttribute("class", "charge");
    price_total.setAttribute("class", "price_total");
    discount_total.setAttribute("class", "dis_tot");
    free_charge.setAttribute("class", "dis_tot");

    var div_2 = document.createElement('div');
    var total_amt = document.createElement('p');
    total_amt.innerHTML = "Total Amount";
    var amt = document.createElement('p');
    amt.textContent = '₹' + (total);

    div_2.append(total_amt, amt);
    div_2.setAttribute("class", "div_2");

    var div_3 = document.createElement('div');
    div_3.setAttribute("class", "div_3");
    var your = document.createElement('p');
    your.textContent = "You will save ₹" + (discount - total) + " on this order";
    div_3.append(your);
    var button = document.createElement('button');
    button.innerHTML = "PLACE ORDER";
    // button.setAttribute("class", "btn");
    button.setAttribute("id", "checkoutBtn");
    document.getElementById("cart_2").append(div_1, div_2, div_3, button);

    var amt1 = document.createElement('input');
    amt1.setAttribute("class", "amt");
    amt1.readOnly = true;
    amt1.name = 'total_amount';
    amt1.value = "Total:  " + '₹' + (total);

    

    document.getElementById('your-form-id').append(amt1)

    document.getElementById("checkoutBtn").addEventListener("click", function () {

        console.log("hello");
        cart_1.style.display = "none";
        cart_2.style.display = "none";
        full.style.display = "block"

    });


    totalAmount = total;

}



function openPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "block";

}







function clearCartAndDisplayMessage() {
    // Clear the cart by sending a request to the server or clearing it locally
    fetch('/clear-cart', {
        method: 'POST',
    })
        .then(() => {
            // After clearing the cart, display a message and hide the cart
            document.getElementById('cart_1').innerHTML = "";
            document.getElementById('cart_2').style.display = "none";
            var row_3 = document.createElement('div');
            row_3.setAttribute("class", "row-3");

            var image = document.createElement('img');
            image.setAttribute("class", "image");
            image.setAttribute("src", "../image/back_book.jpeg");

            var h1 = document.createElement('h1');
            h1.setAttribute("class", "h1");
            h1.innerHTML = "Your cart is empty!";

            var h2 = document.createElement('h2');
            h2.setAttribute("class", "h2");
            h2.innerHTML = "It's a good day to buy items you saved for later!";

            row_3.append(image, h1, h2);
            cart_1.append(row_3);
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
        });
}




function submitForm() {
    // Check if the "cash" radio button is selected
    const cashRadioButton = document.getElementById('cash');

    if (cashRadioButton.checked) {
        // Confirm payment with the user
        const paymentConfirmed = window.confirm("Please click on OK button to confirm your order");

        if (paymentConfirmed) {
            // Payment is confirmed, clear cart and submit the form
            clearCartAndDisplayMessage();
            document.getElementById('your-form-id').submit();
        } else {
            // Payment is not confirmed, do nothing or show a message
            alert("Cancal");
        }
    }
}






document.getElementById('pay').addEventListener('click', async () => {
    try {
        const total = totalAmount; // Replace with the total amount to charge the user


        const response = await fetch('/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                totalAmount: total,
                payment_status: 'online',

            })
        });

        if (response.ok) {
            const orderData = await response.json();
            const razorpayOptions = {
                key: 'Your Key ID',
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.orderId,
                name: 'BookStore',
                description: 'Payment for Order',
                handler: function (response) {
                    console.log('Payment successful:', response);

                    // Automatically submit the form after successful payment
                    clearCartAndDisplayMessage();
                    document.getElementById('your-form-id').submit();
                },
                prefill: {
                    name: 'User Name',
                    email: 'user@example.com'
                }
            };

            const razorpayInstance = new Razorpay(razorpayOptions);
            razorpayInstance.open();
        } else {
            console.error('Error creating order');
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
    }
});



// JavaScript code to handle "Your Info" button click









