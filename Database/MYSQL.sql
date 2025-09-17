-- =========================================================
-- Database: FashionStore (MySQL version)
-- =========================================================
CREATE DATABASE IF NOT EXISTS FashionStore;
USE FashionStore;

-- =========================================================
-- USERS
-- =========================================================
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
    UserID        INT AUTO_INCREMENT PRIMARY KEY,
    Ref           VARCHAR(50) NOT NULL UNIQUE,
    FullName      VARCHAR(100) NOT NULL,
    Email         VARCHAR(255) UNIQUE,
    Phone         VARCHAR(20) UNIQUE,
    PasswordHash  BINARY(64) NOT NULL,
    Role          ENUM('customer','dispatch','manager','admin') NOT NULL,
    CreatedAt     DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt     DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3)
);

-- =========================================================
-- USER ADDRESSES
-- =========================================================
DROP TABLE IF EXISTS UserAddresses;

CREATE TABLE UserAddresses (
    AddressID       INT AUTO_INCREMENT PRIMARY KEY,
    UserID          INT NOT NULL,
    Line1           VARCHAR(200) NOT NULL,
    Line2           VARCHAR(200),
    City            VARCHAR(100) NOT NULL,
    StateProvince   VARCHAR(100),
    PostalCode      VARCHAR(20),
    Country         VARCHAR(100),
    IsDefault       TINYINT(1) NOT NULL DEFAULT 0,
    CreatedAt       DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt       DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3),
    CONSTRAINT FK_UserAddresses_Users FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE INDEX IX_UserAddresses_UserID ON UserAddresses(UserID);

-- =========================================================
-- CATEGORIES
-- =========================================================
DROP TABLE IF EXISTS Categories;

CREATE TABLE Categories (
    CategoryID      INT AUTO_INCREMENT PRIMARY KEY,
    Slug            VARCHAR(120) NOT NULL UNIQUE,
    CategoryName    VARCHAR(100) NOT NULL,
    Description     TEXT,
    DisplayImageUrl VARCHAR(500),
    CreatedAt       DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt       DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3),
    UNIQUE KEY UX_Categories_Name (CategoryName)
);

-- =========================================================
-- PRODUCTS
-- =========================================================
DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
    ProductID       INT AUTO_INCREMENT PRIMARY KEY,
    Ref             VARCHAR(50) NOT NULL UNIQUE,
    CategoryID      INT,
    Name            VARCHAR(200) NOT NULL,
    Description     TEXT,
    CostPrice       DECIMAL(18,2) NOT NULL,
    SellingPrice    DECIMAL(18,2) NOT NULL,
    Color           VARCHAR(50),
    Weight          DECIMAL(10,2),
    SalesCount      INT NOT NULL DEFAULT 0,
    DiscountPercent TINYINT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt       DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryID)
        REFERENCES Categories(CategoryID) ON DELETE SET NULL,
    CONSTRAINT CK_Products_Prices CHECK (SellingPrice >= 0 AND CostPrice >= 0),
    CONSTRAINT CK_Products_Discount CHECK (DiscountPercent BETWEEN 0 AND 100)
);

CREATE INDEX IX_Products_CategoryID ON Products(CategoryID);

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================
DROP TABLE IF EXISTS ProductImages;

CREATE TABLE ProductImages (
    ProductImageID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID      INT NOT NULL,
    ImageUrl       VARCHAR(500) NOT NULL,
    SortOrder      INT NOT NULL DEFAULT 0,
    CreatedAt      DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt      DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3),
    CONSTRAINT FK_ProductImages_Products FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID) ON DELETE CASCADE
);

CREATE INDEX IX_ProductImages_ProductID ON ProductImages(ProductID);

-- =========================================================
-- PRODUCT SIZES
-- =========================================================
DROP TABLE IF EXISTS ProductSizes;

CREATE TABLE ProductSizes (
    ProductSizeID INT AUTO_INCREMENT PRIMARY KEY,
    ProductID     INT NOT NULL,
    Size          VARCHAR(10) NOT NULL,
    Stock         INT NOT NULL DEFAULT 0,
    SKU           VARCHAR(60),
    CreatedAt     DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt     DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3),
    UNIQUE KEY UX_ProductSizes_Product_Size (ProductID, Size),
    CONSTRAINT FK_ProductSizes_Products FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID) ON DELETE CASCADE,
    CONSTRAINT CK_ProductSizes_Stock CHECK (Stock >= 0)
);

CREATE INDEX IX_ProductSizes_ProductID ON ProductSizes(ProductID);

-- =========================================================
-- CART ITEMS
-- =========================================================
DROP TABLE IF EXISTS CartItems;

CREATE TABLE CartItems (
    Id            INT AUTO_INCREMENT PRIMARY KEY,
    UserId        INT NOT NULL,
    ProductSizeID INT NOT NULL,
    Quantity      INT NOT NULL CHECK (Quantity > 0),
    CreatedAt     DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt     DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3),
    CONSTRAINT FK_CartItems_Users FOREIGN KEY (UserId)
        REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_CartItems_ProductSizes FOREIGN KEY (ProductSizeID)
        REFERENCES ProductSizes(ProductSizeID) ON DELETE CASCADE,
    UNIQUE KEY UX_CartItems_User_Size (UserId, ProductSizeID)
);

CREATE INDEX IX_CartItems_User ON CartItems(UserId);

-- =========================================================
-- WISHLISTS
-- =========================================================
DROP TABLE IF EXISTS Wishlists;

CREATE TABLE Wishlists (
    Id            INT AUTO_INCREMENT PRIMARY KEY,
    UserId        INT NOT NULL,
    ProductSizeID INT NOT NULL,
    CreatedAt     DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    CONSTRAINT FK_Wishlists_Users FOREIGN KEY (UserId)
        REFERENCES Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_Wishlists_ProductSizes FOREIGN KEY (ProductSizeID)
        REFERENCES ProductSizes(ProductSizeID) ON DELETE CASCADE,
    UNIQUE KEY UX_Wishlists_User_Size (UserId, ProductSizeID)
);

-- =========================================================
-- ORDERS
-- =========================================================
DROP TABLE IF EXISTS Orders;

CREATE TABLE Orders (
    OrderID            INT AUTO_INCREMENT PRIMARY KEY,
    Ref                VARCHAR(50) NOT NULL UNIQUE,
    UserID             INT NOT NULL,
    Status             ENUM('pending','processing','cancelled','delivered') NOT NULL,
    TotalAmount        DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    ShipFullName       VARCHAR(120),
    ShipLine1          VARCHAR(200),
    ShipLine2          VARCHAR(200),
    ShipCity           VARCHAR(100),
    ShipStateProvince  VARCHAR(100),
    ShipPostalCode     VARCHAR(20),
    ShipCountry        VARCHAR(100),
    CreatedAt          DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    UpdatedAt          DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3) ON UPDATE UTC_TIMESTAMP(3),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE
);

CREATE INDEX IX_Orders_UserID ON Orders(UserID);

-- =========================================================
-- ORDER ITEMS
-- =========================================================
DROP TABLE IF EXISTS OrderItems;

CREATE TABLE OrderItems (
    OrderItemID     INT AUTO_INCREMENT PRIMARY KEY,
    OrderID         INT NOT NULL,
    ProductID       INT NOT NULL,
    ProductSizeID   INT,
    Quantity        INT NOT NULL CHECK (Quantity > 0),
    PricePerUnit    DECIMAL(18,2) NOT NULL,
    CostPerUnit     DECIMAL(18,2),
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID),
    CONSTRAINT FK_OrderItems_ProductSizes FOREIGN KEY (ProductSizeID)
        REFERENCES ProductSizes(ProductSizeID)
);

CREATE INDEX IX_OrderItems_OrderID ON OrderItems(OrderID);

-- =========================================================
-- PAYMENTS
-- =========================================================
DROP TABLE IF EXISTS Payments;

CREATE TABLE Payments (
    PaymentID       INT AUTO_INCREMENT PRIMARY KEY,
    OrderID         INT NOT NULL,
    Amount          DECIMAL(18,2) NOT NULL CHECK (Amount >= 0),
    Method          VARCHAR(40) NOT NULL,
    Status          ENUM('pending','succeeded','failed','refunded') NOT NULL,
    TransactionRef  VARCHAR(120),
    PaidAt          DATETIME(3),
    CreatedAt       DATETIME(3) NOT NULL DEFAULT UTC_TIMESTAMP(3),
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID) ON DELETE CASCADE
);

CREATE INDEX IX_Payments_OrderID ON Payments(OrderID);

-- =========================================================
-- COUPONS
-- =========================================================
DROP TABLE IF EXISTS Coupons;

CREATE TABLE Coupons (
    CouponID        INT AUTO
