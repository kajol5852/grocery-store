var productModal = $("#productModal");
    $(function () {

        //JSON data by API call
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.uom_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    $('#saveButton').click(function () {
        var productData = {
            name: $('#name').val(),
            unit: $('#uomSelect').val(),
            price: $('#price').val()
        };

       
        $.ajax({
            url: productSaveApiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(productData),
            success: function (response) {
                if (response.success) {
                    
                    loadProducts();
                    // Close modal
                    $('#productModal').modal('hide');
                    // Reset form
                    $('#productForm')[0].reset();
                } else {
                    alert('Error saving product');
                }
            },
            error: function () {
                alert('Error saving product');
            }
        });
    });


   
    $(document).on("click", ".delete-product", function (){
        var tr = $(this).closest('tr');
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });

    fetch('http://127.0.0.1:5000/getUOM')
    .then(response => response.json())
    .then(data => {
        data.forEach(uom => {
            let option = document.createElement('option');
            option.value = uom.uom_id;
            option.textContent = uom.uom_name;

            
            document.getElementById('uomSelect').appendChild(option);  
         });
    })
    .catch(error => console.error('Error fetching UOM data:', error));
   
