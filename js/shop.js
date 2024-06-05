// Function to handle adding items to the cart
function addToCart(p_id, p_name, p_price, p_image, p_del_price) {
  const data = {
    p_id,
    p_name,
    p_price,
    p_image,
    p_del_price
  };

  fetch('/add-to-cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(() => {
      // Handle success, e.g., show a message to the user
      alert('Item added to the cart!');
    })
    .catch(error => {
      console.error('Error:', error);
    });
}



//for searchh

const search = () => {
  const searchbox = document.getElementById('txtSearch').value.toUpperCase();
  const storeitem = document.getElementById('product-list');
  const prod = document.querySelectorAll('.product');
  const pname = document.getElementsByTagName('h3');

  for (var i = 0; i < pname.length; i++) {
    let match = prod[i].getElementsByTagName('h3')[0];

    if (match) {
      let textvalue = match.textContent || match.innerHTML
      if (textvalue.toUpperCase().indexOf(searchbox) > -1) {
        prod[i].style.display = "";
      }
      else {
        prod[i].style.display = "none";
      }
    }
  }
}

//for  filters


document.addEventListener("DOMContentLoaded", function () {
  const categoryItems = document.querySelectorAll('.category-list li');
  const products = document.querySelectorAll('.product');

  categoryItems.forEach(item => {
      item.addEventListener('click', function () {
          const category = this.textContent; // Get the text content of the clicked category
          products.forEach(product => {
              const productCategory = product.querySelector('.name').textContent;
              if (category === 'All' || productCategory === category) {
                  product.style.display = 'block';
              } else {
                  product.style.display = 'none';
              }
          });
      });
  });
});

//open home
 function openhome()
 {
  location.replace("../index")
 }