from flask import Flask, request, jsonify
from sql_connection import get_sql_connection
import products_dao
import orders_dao
import uom_dao
from flask_cors import CORS  # To handle CORS easily


app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

connection = get_sql_connection()

@app.route('/getUOM', methods=['GET'])
def get_uom():
    response = uom_dao.get_uoms(connection)
    return jsonify(response)
    response.headers.add('access-control-allow-origin', '*')
    return response



@app.route('/getProducts', methods=['GET'])
def get_products():
    response = products_dao.get_all_products(connection)
    return jsonify(response)
    response.headers.add( 'access-control-allow-origin', '*' )
    return response


@app.route('/insertProduct', methods=['POST'])
def insert_product():
    request_payload = request.json  # Use request.json for JSON data
    product_id = products_dao.insert_new_product(connection, request_payload)
    return jsonify({'product_id': product_id})
    response.headers.add( 'access-control-allow-origin', '*' )
    return response


@app.route('/getAllOrders', methods=['GET'])
def get_all_orders():
    response = orders_dao.get_all_orders(connection)
    return jsonify(response)
    response.headers.add( 'access-control-allow-origin', '*' )
    return response


@app.route('/insertOrder', methods=['POST'])
def insert_order():
    try:
        data = request.get_json()
        customer_name = data.get('customerName')
        total = data.get('total')
        order_details = data.get('order_details')

        cursor = connection.cursor()

        # Insert order into orders table
        insert_order_query = "INSERT INTO orders (customer_name, total) VALUES (%s, %s)"
        cursor.execute(insert_order_query, (customer_name, total))
        order_id = cursor.lastrowid

        # Insert order details into order_details table
        insert_order_details_query = "INSERT INTO order_details (order_id, product_id, quantity, total_price) VALUES (%s, %s, %s, %s)"
        for detail in order_details:
            cursor.execute(insert_order_details_query, (order_id, detail['product_id'], detail['quantity'], detail['total_price']))

        connection.commit()  # Commit changes to the database

        cursor.close()

        return jsonify({"message": "Order saved successfully"}), 200

    except Exception as e:
        print(str(e))
        connection.rollback()  # Rollback in case of error
        return jsonify({"error": "Failed to save order"}), 500



@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    return_id = products_dao.delete_product(connection, request.form['product_id'])
    return jsonify({'product_id': return_id})
    response.headers.add('access-control-allow-origin', '*')
    return response



if __name__ == "__main__":
    print("Starting Python Flask Server For Grocery Store Management System")
    app.run(host='0.0.0.0', port=5000)  # Use '0.0.0.0' to make it accessible externally