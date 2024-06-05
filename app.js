const conn = require("./connection");
const cors = require('cors');
const express = require('express');
const multer = require('multer'); // Import multer module for inserting image
const session = require('express-session');

// Define a custom helper for equality check

const app = express();
const bodyparser = require('body-parser');


// Multer configuration for image upload
const storage = multer.memoryStorage(); // use this for image
const upload = multer({ storage: storage });  // also use this for image
 
app.use(express.json());

app.use(cors());  //for payment 

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// Add this middleware to parse JSON bodies with a size limit of 10MB


app.use('/public', express.static('public'));
app.use('/image', express.static('image'));
//extra imahes
app.use('/images', express.static('images'));

app.use('/js', express.static('js'));


app.set("view engine", "hbs");
app.set("views", "./view");



// Route to render the user registration form
app.use(session({
    secret: 'your-secret-key', // Replace with a secure secret key
    resave: false,
    saveUninitialized: true
    
}));

  



app.get('/user_reg', (req, res) => {
   res.render("user_reg");
});






let cart = [];


// Route to handle user registration form submission

app.post('/user_reg', (req, res) => {
    const { u_id, u_name, u_email, u_mobile, u_password, u_con_pass, u_address, u_city, pincode, state } = req.body;

    // Check if the email or user ID already exists in the database
    const checkQuery = "SELECT * FROM user WHERE u_id = ? OR u_email = ?";
    conn.query(checkQuery, [u_id, u_email], (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Error checking user existence:", checkErr);
            return res.status(500).send("Error checking user existence");
        }

        // If user with the same ID or email already exists, return an error
        if (checkResults.length > 0) {
           // return res.status(400).send("User with the same ID or email already exists.");
           return res.render('user_reg', { error: 'User ID or email already exists.' });
       
        }

        // Continue with user registration if no user with the same ID or email found
        if (u_password !== u_con_pass) {
            return res.render('user_reg', { error: 'Passwords do not match with confirm password' });
        }

        if (u_password.length < 8) {
            return res.render('user_reg', { error: 'Passwords length should be greater than 7' });
        }

        if (pincode.length !== 6) {
            return res.render('user_reg', { error: 'Please enter a valid 6-digit pincode' });
        }

        const insertQuery = "INSERT INTO user (u_id, u_name, u_email, u_mobile, u_password, u_con_pass, u_address, u_city, pincode, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        conn.query(insertQuery, [u_id, u_name, u_email, u_mobile, u_password, u_con_pass, u_address, u_city, pincode, state], (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Error inserting data into the database");
            } else {
                console.log("Data inserted successfully");
                res.redirect('/user_login'); // Redirect to the user_login page
            }
        });
    });
});


// Route to render the user login form
app.get('/user_login', (req, res) => {
   
    res.render("user_login");
 });


 


 app.post('/product', upload.single('p_image'), (req, res) => {
    const { p_name, p_price, p_del_price, category } = req.body;
    const p_id = generateRandomId();
    let cate; // Declare cate variable outside if-else blocks
    if(category=='Men')
    {
         cate='Men';
    }
    else if(category=='Women')
    {
        cate='Women';
    }
    else
    {
        cate='Kids';
    }
    const insertQuery = "INSERT INTO product (p_id, p_name, p_price, p_del_price, p_image,cate) VALUES (?, ?, ?, ?, ?,?)";

    conn.query(insertQuery, [p_id, p_name, p_price, p_del_price, req.file.buffer, cate], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting data into the database");
        } else {
            console.log("Data inserted successfully");
            res.redirect('/product');
        }
    });
});

 
 
 
 function generateRandomId() {
    return Math.floor(Math.random() * 1000000); // Change the range as needed
}






app.get('/product', (req, res) => {
    const qry = "SELECT  p_id,p_name, p_price, p_del_price,p_image,cate FROM product"; // Modify the query to select the desired columns
    conn.query(qry, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
          } else {

            results.forEach(book => {
                book.p_image = book.p_image.toString('base64');
            });

            console.log("Fetched data:", results);
            res.render('product', { books: results });
          }
    });
  });



  app.get('/shop',(req, res) => {
    const qry = "SELECT p_id, p_name, p_price, p_del_price,p_image,cate FROM product"; // Modify the query to select the desired columns
    const user = req.session.user;
    conn.query(qry, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
          } else {

            results.forEach(book => {
                book.p_image = book.p_image.toString('base64');
            });

            console.log("Fetched data:", results);
            res.render('shop', {user, books: results });
           
          }

     });

});





// Define a middleware function to check if the user is authenticated
function requireAuth(req, res, next) {
    if (!req.session.user) {
        // If the user is not authenticated, redirect them to the login page
        res.redirect('/user_login'); // Replace '/login' with the actual URL of your login page
    } else {
        // If the user is authenticated, continue to the next middleware
        next();
    }
}

// Use the middleware to protect the '/index' route
app.get('/index', requireAuth, (req, res) => {
    const qry = "SELECT  p_name, p_price, p_del_price, p_image FROM product"; // Modify the query to select the desired columns
    const user = req.session.user; // Get the user object from the session
    
    conn.query(qry, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
        } else {
            results.forEach(book => {
                book.p_image = book.p_image.toString('base64');
            });

            console.log("Fetched data:", results);
            res.render('index', { user, books: results });
        }
    });
});











 
const Razorpay = require('razorpay');
const rzp = new Razorpay({
    key_id: 'Your Key ID', 
   key_secret: 'Your Secret Key'  
});




// Inside app.js
app.post('/create-order', async (req, res) => {
    try {
        const totalAmount = req.body.totalAmount; // Get the total amount from the request
        
       
        const amountInPaise = totalAmount * 100;

        // Create an order with the calculated amount
        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: 'order_receipt'
        };
        const order = await rzp.orders.create(options);
        
        // Respond with the order ID and amount
        res.json({ orderId: order.id, amount: amountInPaise }); 
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error creating order' }); // Send JSON response
    }
});



// Confirm the payment
app.post('/confirm-payment', async (req, res) => {
    try {
        const paymentId = req.body.paymentId;
        const orderId = req.body.orderId;

        
        const payment = await rzp.payments.fetch(paymentId);
        if (payment.order_id === orderId && payment.status === 'captured') {
           
            res.sendStatus(200);
        } else {
            
            res.sendStatus(400);
        }
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.sendStatus(500);
    }


});





app.post('/user_login', (req, res) => {
    const { u_email, u_password } = req.body;

    // Check if the user exists in the database
    const selectQuery = "SELECT * FROM user WHERE u_email = ? AND u_password = ?";

    conn.query(selectQuery, [u_email, u_password], (err, results) => {
        if (err) {
            console.error("Error querying the database:", err);
            res.status(500).send("Error querying the database");
        } else {
            if (results.length === 1) {
                // User found, set the user's session with role
                const user = results[0];
                req.session.user = {
                    u_id: user.u_id,
                    u_name: user.u_name,
                    u_email: user.u_email,
                    u_mobile: user.u_mobile,
                    u_address: user.u_address,
                    u_city: user.u_city,
                    pincode: user.pincode,
                    state: user.state,
                };
                req.session.cart = []; // Initialize the user's cart
                res.redirect('/index'); // Redirect to the appropriate route
            } else {
                // User not found or password is incorrect
                res.render('user_login', { error: 'Invalid email or password' });
            }
            
        }
    });
});





app.post('/cart', (req, res) => {
    const { total_amount, pay_type, p_id, p_name, p_image } = req.body;
    const { u_name, u_address, u_city, u_id, state, pincode } = req.session.user;
    const user = req.session.user;
    const or_id = generateRandomId();
    const status = "Ordered";
    let order_rec = "-"; // Declare payment_status as a variable, not a constant
    const payment_mode = (pay_type === 'cash') ? 'cash' : 'online';

    const order_date = new Date();
    order_date.setUTCHours(order_date.getUTCHours() + 5); // Adjusting for IST
    order_date.setUTCMinutes(order_date.getUTCMinutes() + 30); // Adjusting for IST
    const formattedDate = order_date.toISOString(); // Format date in IST

    // Ensure p_image is base64 encoded
    const base64Image = Buffer.from(p_image, 'base64');

    // Create the order details
    const orderDetails = {
        or_id: or_id,
        payment_mode: payment_mode,
        order_rec: order_rec,
        order_date: formattedDate,
        total_amount: total_amount,
        p_id: p_id,
        p_name: p_name,
        u_name: u_name,
        u_address: u_address,
        u_city: u_city,
        u_id: u_id,
        state: state,
        pincode: pincode,
        status: status,
        p_image: base64Image, // Store the base64 encoded image
    };

    const insertQuery = "INSERT INTO place_order SET ?";

    conn.query(insertQuery, orderDetails, (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            res.status(500).send("Error inserting data into the database");
        } else {
            console.log("Data inserted successfully");
            res.redirect('/cart');
        }
    });
});


 

 app.post('/add-to-cart', requireAuth,(req, res) => {
    const { p_id, p_name, p_price, p_image, p_del_price } = req.body;

    console.log("Received product data:", req.body); // extra Log received product data
    const userCart = req.session.cart || []; // Get user's cart from the session or create an empty cart if it doesn't exist

    userCart.push({ p_id, p_name, p_price, p_image, p_del_price });
    req.session.cart = userCart; // Store the updated cart in the session
    console.log("Updated cart:", req.session.cart); // extra Log updated cart
    res.redirect('/cart');
});




     


 
 

 app.get('/cart',requireAuth, (req, res) => {
    const userCart = req.session.cart || []; // Get user's cart from the session
    const user=req.session.user;
    res.render('cart', { cart: userCart, user: req.session.user ,user});
});



 


 

  app.get('/get-cart-items',(req, res) => {
    const userCart = req.session.cart || []; // Get user's cart from the session
    res.json({ cart: userCart });
});

 
 
  

  app.post('/remove-from-cart', (req, res) => {
    const { p_id } = req.body;
    const userCart = req.session.cart || [];

    // Find the index of the item in the user's cart based on p_id
    const index = userCart.findIndex(item => item.p_id === p_id);

    if (index !== -1) {
        // Remove the item from the user's cart if found
        userCart.splice(index, 1);
        req.session.cart = userCart; // Update the cart in the session
        res.json({ message: 'Item removed from the cart!' });
    } else {
        res.status(404).json({ message: 'Item not found in the cart.' });
    }
});


  
app.post('/clear-cart', (req, res) => {
    req.session.cart = []; // Clear the user's cart in the session

    // Send a success response
    res.status(200).json({ message: 'Cart cleared successfully' });
});
 



app.get('/order', requireAuth,(req, res) => {
    const user = req.session.user;
    if (!user) {
        
        return res.redirect('/user_login');
    }

    const userId = user.u_id; 
    const qry = "SELECT or_id, order_date, order_rec, payment_mode, total_amount, p_id, p_name, u_city, u_address,u_name,pincode,state,status,p_image FROM place_order WHERE u_id = ?";
  
   
    conn.query(qry, [userId], (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
        } else {
            
            results.forEach(book => {
                book.p_image = book.p_image.toString('base64');
            });
            console.log("Fetched data:", results);
            res.render('order', { user, books: results });
        }
    });
});


 





  app.get('/admin', (req, res) => {
    const selectUserQuery = 'SELECT COUNT(*) AS userCount FROM user';
    const selectOrderQuery = 'SELECT COUNT(*) AS orderCount FROM place_order';
    const selectBookCount = 'SELECT COUNT(*) AS countbook FROM product';
     conn.query(selectUserQuery, (err, userResults) => {
      if (err) {
        console.error('Error querying the user count:', err);
        res.status(500).send('Error querying the user count');
        return;
      }
  
      conn.query(selectOrderQuery, (err, orderResults) => {
        if (err) {
          console.error('Error querying the order count:', err);
          res.status(500).send('Error querying the order count');
          return;
        }
  
        conn.query(selectBookCount, (err, bookResults) => {
          if (err) {
            console.error('Error querying the book count:', err);
            res.status(500).send('Error querying the book count');
            return;
          }

        
            const userCount = userResults[0].userCount;
            const orderCount = orderResults[0].orderCount;
            const bookCount = bookResults[0].countbook;
          
            const qry = "SELECT a_name FROM admin"; 
           conn.query(qry, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
          } else {
             console.log("Fetched data:", results);
          
            res.render('admin', { userCount, orderCount, bookCount,books: results });
         
          }

           });
        });
      });
    });
  });



  

app.get('/admin_order', (req,res)=>
{
    const qry = "SELECT or_id, order_date, payment_mode,total_amount,p_id,p_name,u_name,u_address,order_rec,u_city,u_id,pincode,state,status FROM place_order"; // Modify the query to select the desired columns
    conn.query(qry, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
          } else {

            
             console.log("Fetched data:", results);
            res.render('admin_order', { books: results });
          }

     });
})

app.get('/admin_feedback', (req,res)=>
{
    const qry = "SELECT u_id, name,email,message FROM feedback"; // Modify the query to select the desired columns
    conn.query(qry, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error fetching data");
          } else {
             console.log("Fetched data:", results);
            res.render('admin_feedback', { books: results });
          }

     });
})






app.get('/admin_login' ,(req,res)=>
{
    res.render("admin_login");
})


app.post('/admin_login', (req, res) => {
    const { a_id,a_email, a_password } = req.body;
 
    // Check if the user exists in the database
    const selectQuery = "SELECT * FROM admin WHERE a_id=? AND a_email = ? AND a_password = ?";
    
    conn.query(selectQuery, [a_id, a_email, a_password], (err, results) => {
        if (err) {
            console.error("Error querying the database:", err);
            res.status(500).send("Error querying the database");
        } else {
            
              res.redirect('/admin'); // Replace with the appropriate route
               
            } 
        });
    });
 

    app.get('/admin_users', (req,res)=>
    {
        const qry = "SELECT u_id, u_name, u_address, u_email,u_mobile,u_city FROM user"; // Modify the query to select the desired columns
        conn.query(qry, (err, results) => {
            if (err) {
                console.error("Error fetching data:", err);
                res.status(500).send("Error fetching data");
              } else {
                 console.log("Fetched data:", results);
                res.render('admin_users', { books: results });
              }
    
         });
    })
    
    

     app.get('/profile', (req, res) => {
        // Get the user's details from the session
        const user = req.session.user;
    
        if (!user) {
            // If the user is not logged in, redirect them to the login page
            return res.redirect('/user_login');
        }
    
        // Render the user profile page
        res.render('profile', { user });
    });
    
    app.get('/profile_update', (req, res) => {
        const user = req.session.user;
    
        if (!user) {
            return res.redirect('/user_login');
        }
    
        res.render('profile_update', { user });
    });

    
    

    app.post('/profile_update', (req, res) => {
        const { u_name, u_mobile, u_address, u_city, pincode, state } = req.body;
        const user = req.session.user;
    
        if (!user) {
            return res.redirect('/user_login');
        }
        if (pincode.length > 6 || pincode.length < 6) {
            return res.status(400).send("Please enter a valid Pincode");
        }
    
        // Update user's information in the database using user.u_id
        const updateQuery = "UPDATE user SET u_mobile = ?, u_name = ?, u_address = ?, u_city = ?, pincode = ?, state = ? WHERE u_id = ?";
        conn.query(updateQuery, [u_mobile, u_name, u_address, u_city, pincode, state, user.u_id], (err, result) => {
            if (err) {
                console.error("Error updating user profile:", err);
                res.status(500).send("Error updating user profile");
            } else {
                // Update user information in the session
                user.u_name = u_name;
                user.u_mobile = u_mobile;
                user.u_address = u_address;
                user.u_city = u_city;
                user.pincode = pincode;
                user.state = state;
                req.session.user = user;
    
                console.log("Data updated successfully in the database");
                res.redirect('/profile');
            }
        });
    });
    
    
// Route to delete a book
app.post('/mark-order-received', (req, res) => {
    const { or_id } = req.body;
   // const updateQuery = "UPDATE place_order SET order_rec = CURRENT_DATE()+7 WHERE or_id = ?";
   const updateQuery = "UPDATE place_order SET order_rec = DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY) WHERE or_id = ?";

    conn.query(updateQuery, [or_id], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            res.status(500).send("Error updating order status");
        } else {
            console.log("Order status updated successfully");
            res.redirect('/admin_order'); 
        }
    });
});



app.get('/index', requireAuth,(req, res) => {
    const user = req.session.user;
    res.render("feedback",{user});
 });

 app.post('/index', (req, res) => {
  //  const user = req.session.user;
    const { u_id, name, email, message } = req.body;
    const insertQuery = "INSERT INTO feedback ( u_id, name, email, message) VALUES (?, ?, ?, ?)";

    conn.query(insertQuery, [ u_id, name, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting feedback data:", err);
            res.status(500).send("Error inserting feedback data into the database");
        } else {
            console.log("Feedback data inserted successfully");
           res.redirect('/index'); // Redirect to the appropriate route after feedback submission
         
        }
    });
});

app.post('/delete-book', (req, res) => {
    const bookIdToDelete = req.body.p_id; // Get the book ID to delete from the request
    console.log(bookIdToDelete);
    // Define a DELETE query to delete the book with the specified p_id
    const deleteQuery = "DELETE FROM product WHERE p_id = ?";
    
    conn.query(deleteQuery, [bookIdToDelete], (err, result) => {
        if (err) {
            console.error("Error deleting book:", err);
            res.status(500).send("Error deleting book from the database");
        } else {
            console.log("Book deleted successfully");
             res.sendStatus(200);
        }
    });
});



app.get('/update-book/:p_id', (req, res) => {
    const bookId = req.params.p_id;

    // Retrieve book details by bookId from the database
    const selectQuery = "SELECT * FROM product WHERE p_id = ?";
    conn.query(selectQuery, [bookId], (err, result) => {
        if (err) {
            console.error("Error fetching book details:", err);
            res.status(500).send("Error fetching book details");
        } else {
            // Render the book update form with the retrieved book details
            res.render('update_book_form', { book: result[0] });
        }
    });
});

app.post('/update-book/:p_id', (req, res) => {
    const bookId = req.params.p_id;
    const { p_name, p_price, p_del_price } = req.body;

    // Update book details in the database
    const updateQuery = "UPDATE product SET p_name = ?, p_price = ?, p_del_price = ? WHERE p_id = ?";
    conn.query(updateQuery, [p_name, p_price, p_del_price, bookId], (err, result) => {
        if (err) {
            console.error("Error updating book details:", err);
            res.status(500).send("Error updating book details");
        } else {
            console.log("Book details updated successfully");
            // Redirect to the book listing page or any other appropriate page
            res.redirect('/product');
        }
    });
});

app.get('/landing', (req, res) => {
   
    res.render("landing");
 });

// Add this route in your Express server
app.get('/logout', (req, res) => {
    // Destroy the user session to log them out
    req.session.destroy((err) => {
        if (err) {
            console.error("Error logging out:", err);
            res.status(500).send("Error logging out");
        } else {
            // Redirect the user to the home page or any other appropriate page
            res.redirect('/landing');
        }
    });
});

app.post('/update-order-status', (req, res) => {
    const { or_id, status } = req.body;

    // Define a SQL query to update the status of the order based on the selected status
    const updateStatusQuery = "UPDATE place_order SET status = ? WHERE or_id = ?";

    conn.query(updateStatusQuery, [status, or_id], (err, result) => {
        if (err) {
            console.error("Error updating order status:", err);
            res.status(500).send("Error updating order status");
        } else {
            console.log("Order status updated successfully");

            // Redirect to the admin_order page or any other appropriate page
            res.redirect('/admin_order');
        }
    });
});


app.post('/delete-order', (req, res) => {
    const bookIdToDelete = req.body.or_id; // Get the book ID to delete from the request
    console.log(bookIdToDelete);
    // Define a DELETE query to delete the book with the specified p_id
    const deleteQuery = "DELETE FROM place_order WHERE or_id = ?";
    
    conn.query(deleteQuery, [bookIdToDelete], (err, result) => {
        if (err) {
            console.error("Error deleting book:", err);
            res.status(500).send("Error deleting book from the database");
        } else {
            console.log("Book deleted successfully");
             res.sendStatus(200);
        }
    });
});

app.listen(3000);








