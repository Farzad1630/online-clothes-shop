# 🛍️ OnlineShop Database Schema

This folder contains SQL scripts related to the database design of the **OnlineShop** project.  
The schema is designed for a clothing e-commerce website with user accounts, product listings, shopping cart, wishlist, and order tracking.

---

## 📁 Files

| File name            | Description                                       |
|----------------------|---------------------------------------------------|
| `create-tables.sql`  | SQL script to create all core database tables     |
| `seed-data.sql`      | *(Optional)* Sample data to populate initial state |
| `ERD-diagram.png`    | *(Optional)* Visual Entity-Relationship Diagram   |

---

## 🧱 Tables Overview

### 1. `Users`
Stores information about registered users.
- `Id`: Primary key
- `FullName`, `Email`, `PasswordHash`
- `CreatedAt`: Timestamp of registration

### 2. `Categories`
Product category list (e.g. Men, Women, Kids).
- `Id`: Primary key
- `Name`: Category name

### 3. `Products`
Clothing items available for purchase.
- `Id`, `Name`, `Description`, `Price`, `ImageUrl`
- `DiscountPercent`: Normal discount
- `QuantityAvailable`: Inventory count
- `IsAvailable`: Whether it's visible to users
- `CategoryId`: Foreign key to `Categories`

### 4. `Wishlists`
Tracks favorite products per user.
- One user can have multiple products in their wishlist
- `UserId`, `ProductId`: Composite Unique

### 5. `CartItems`
User's current shopping cart.
- Contains selected products with quantity
- One product per user in cart (enforced by `UNIQUE`)

### 6. `Orders`
Stores completed (or pending) orders.
- `UserId`: The buyer
- `TotalPrice`: Final calculated total
- `Status`: (e.g. Pending, Completed)
- `CreatedAt`: Timestamp

### 7. `OrderItems`
Items associated with each order.
- `OrderId`: Foreign key
- `ProductId`, `Quantity`, `UnitPrice`

### 8. `SpecialOffers`
Tracks promotional campaigns for specific products.
- Extra discount for limited time
- `StartDate`, `EndDate`

---

## ✅ Notes

- All foreign key relationships are defined with appropriate constraints.
- Composite `UNIQUE` constraints ensure no duplicates in `Wishlists` and `CartItems`.
- Future expansion (payment gateway, shipping, admin panel) is possible via new tables or columns.

---

## 🛠️ Usage

1. Open `create-tables.sql` in SQL Server Management Studio (SSMS)
2. Make sure you're connected to the `OnlineShopDB` database
3. Execute the script to create all necessary tables
4. *(Optional)* Run `seed-data.sql` to insert test data

---

## 📌 Author
Designed by [YourName] for the OnlineShop clothing e-commerce platform.
