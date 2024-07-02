import datetime
import mysql.connector
import sys

# Set a higher recursion limit
new_limit = 10000  # Replace with your desired limit

# Set the new recursion limit
sys.setrecursionlimit(new_limit)

# Now define your recursive functions and proceed with your code
def recursive_function(n):
    if n <= 0:
        return 1
    else:
        return n * recursive_function(n - 1)


__cnx = None

def get_sql_connection():
  print("Opening mysql connection")
  global __cnx

  if __cnx is None:
    __cnx = mysql.connector.connect(user='root', password='Kajol@23', database='grocery_store')

  return __cnx