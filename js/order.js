$(document).ready(function () {
    var productPrices = {};


    $.get(productListApiUrl, function (response) {
        productPrices = {};
        if(response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function(index, product) {
                options += '<option value="'+ product.product_id +'">'+ product.name +'</option>';
                productPrices[product.product_id] = product.price_per_unit;
            });
            $(".product-box").find("select").empty().html(options);
        }
    });

    $("#addMoreButton").click(function () {
        var row = $(".product-box").html();
        $(".product-box-extra").append(row);
        $(".product-box-extra .remove-row").last().removeClass('hideit');
        $(".product-box-extra .product-price").last().text('0.0');
        $(".product-box-extra .product-qty").last().val('1');
        $(".product-box-extra .product-total").last().text('0.0');
    });

    $(document).on("click", ".remove-row", function () {
        $(this).closest('.row').remove();
        calculateValue();
    });

    $(document).on("change", ".cart-product", function () {
        var product_id = $(this).val();
        var price = productPrices[product_id];

        $(this).closest('.row').find('#product_price').val(price);
        calculateValue();
    });

    $(document).on("change", ".product-qty", function (e) {
        calculateValue();
    });

    $("#saveOrder").on("click", function(){
        var formData = $("form").serializeArray();
        var requestPayload = {
            customer_name: null,
            total: null,
            order_details: []
        };
        var orderDetails = [];
        for(var i=0;i<formData.length;++i) {
            var element = formData[i];
            var lastElement = null;

            switch(element.name) {
                case 'customerName':
                    requestPayload.customer_name = element.value;
                    break;
                case 'product_grand_total':
                    requestPayload.grand_total = element.value;
                    break;
                case 'product':
                    requestPayload.order_details.push({
                        product_id: element.value,
                        quantity: null,
                        total_price: null
                    });
                    break;
                case 'qty':
                    lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                    lastElement.quantity = element.value;
                    break;
                case 'item_total':
                    lastElement = requestPayload.order_details[requestPayload.order_details.length-1];
                    lastElement.total_price = element.value;
                    break;
            }
        }
        callApi("POST", orderSaveApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });
});

   
     function calculateTotal() {
        var price = parseFloat(document.getElementById('product_price').value);
        var quantity = parseInt(document.getElementById('quantity').value);
        var total = price * quantity;

        if (!isNaN(total)) {
            document.getElementById('item_total').value = total.toFixed(2);
            document.getElementById('item_total').value = ""; 
        }
    }


    document.addEventListener('input', function(event) {
        if (event.target.matches('.product-price, #quantity')) {
            calculateTotal();
        }
    });


    calculateTotal();

   
function saveProduct() {
   
    var productName = document.getElementById('product').value; 
    var price = document.getElementById('product_price').value;
    var quantity = document.getElementById('quantity').value;


    var totalPrice = parseFloat(price) * parseInt(quantity);
    document.getElementById('item_total').value = totalPrice.toFixed(2);

    
    var formData = {
        product: productName,
        price: price,
        quantity: quantity,
        total: totalPrice
    };

   
    $.ajax({
        type: 'POST', 
        url: 'http://127.0.0.1:5000/insertOrder', 
        data: formData,
        success: function(response) {
            console.log('Product saved successfully:', response);
           
            clearForm();
        },
        error: function(xhr, status, error) {
            console.error('Error saving product:', error);
            alert('Failed to save product. Please try again.');
        }
    });
}


function clearForm() {
    document.getElementById('product').value = ''; 
    document.getElementById('product_price').value = '0.0'; 
    document.getElementById('quantity').value = '1'; 
    document.getElementById('item_total').value = ''; 
}

  
  $(document).on('click', '.remove-row', function() {
    $(this).closest('.product-item').remove();
    calculateGrandTotal();
});




$(document).ready(function() {
    // Event listener for Save button click
    $('#saveOrder').click(function() {
        // Prepare data to send to backend
        var orderData = {
            customer_name: $('#Customer Name').val(), // Assuming this is your customer name field
            products: []
        };

        // Iterate over each product item
        $('.product-item').each(function(index, item) {
            var product = {
                product_name: $(item).find('.cart-product').val(), // Product name from dropdown
                price: parseFloat($(item).find('.product-price').val()), // Product price
                quantity: parseInt($(item).find('.product-qty').val()), // Quantity
                total: parseFloat($(item).find('.product-total').val()) // Total price for this item
            };

            orderData.products.push(product);
        });

       
        $.ajax({
            url: 'http://127.0.0.1:5000/insertOrder',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function(response) {
               
                console.log('Order saved successfully:', response);
              
                alert('Order saved successfully!');
            },
            error: function(xhr, status, error) {
                
                console.error('Error saving order:', error);
                alert('Error saving order. Please try again.');
            }
        });
    });
});