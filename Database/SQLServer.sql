/* =========================================================
   Database: FashionStore
   ========================================================= */
IF DB_ID('FashionStore') IS NULL
    CREATE DATABASE FashionStore;
GO
USE FashionStore;
GO

/* =======================
   SCHEMAS & EXTENSIONS
   ======================= */
-- (اگر لازم داری می‌تونی Schema سفارشی بسازی)
-- CREATE SCHEMA shop AUTHORIZATION dbo;

------------------------------------------------------------
-- USERS & AUTH
------------------------------------------------------------
IF OBJECT_ID('dbo.Users','U') IS NOT NULL DROP TABLE dbo.Users;
GO
CREATE TABLE dbo.Users (
    UserID          INT IDENTITY(1,1) PRIMARY KEY,
    Ref             NVARCHAR(50)  NOT NULL UNIQUE,
    FullName        NVARCHAR(100) NOT NULL,
    Email           NVARCHAR(255) NULL UNIQUE,
    Phone           NVARCHAR(20)  NULL UNIQUE,
    PasswordHash    VARBINARY(64) NOT NULL,  -- مثلاً SHA2_512
    Role            NVARCHAR(30)  NOT NULL
                    CHECK (Role IN (N'customer',N'dispatch',N'manager',N'admin')),
    CreatedAt       DATETIME2(3)  NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2(3)  NOT NULL DEFAULT GETUTCDATE()
);
GO

-- آدرس‌های متعدد کاربر
IF OBJECT_ID('dbo.UserAddresses','U') IS NOT NULL DROP TABLE dbo.UserAddresses;
GO
CREATE TABLE dbo.UserAddresses (
    AddressID       INT IDENTITY(1,1) PRIMARY KEY,
    UserID          INT NOT NULL,
    Line1           NVARCHAR(200) NOT NULL,
    Line2           NVARCHAR(200) NULL,
    City            NVARCHAR(100) NOT NULL,
    StateProvince   NVARCHAR(100) NULL,
    PostalCode      NVARCHAR(20)  NULL,
    Country         NVARCHAR(100) NULL,
    IsDefault       BIT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_UserAddresses_Users
        FOREIGN KEY (UserID) REFERENCES dbo.Users(UserID) ON DELETE CASCADE
);
GO
CREATE INDEX IX_UserAddresses_UserID ON dbo.UserAddresses(UserID);


------------------------------------------------------------
-- CATEGORIES
------------------------------------------------------------
IF OBJECT_ID('dbo.Categories','U') IS NOT NULL DROP TABLE dbo.Categories;
GO
CREATE TABLE dbo.Categories (
    CategoryID         INT IDENTITY(1,1) PRIMARY KEY,
    Slug               NVARCHAR(120) NOT NULL UNIQUE,
    CategoryName       NVARCHAR(100) NOT NULL,
    [Description]      NVARCHAR(MAX) NULL,
    DisplayImageUrl    NVARCHAR(500) NULL,
    CreatedAt          DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt          DATETIME2(3) NOT NULL DEFAULT GETUTCDATE()
);
GO
CREATE UNIQUE INDEX UX_Categories_Name ON dbo.Categories(CategoryName);


IF OBJECT_ID('dbo.Products','U') IS NOT NULL DROP TABLE dbo.Products;
GO
CREATE TABLE dbo.Products (
    ProductID       INT IDENTITY(1,1) PRIMARY KEY,
    Ref             NVARCHAR(50)  NOT NULL UNIQUE,
    CategoryID      INT           NULL,
    Name            NVARCHAR(200) NOT NULL,
    [Description]   NVARCHAR(MAX) NULL,
    CostPrice       DECIMAL(18,2) NOT NULL,
    SellingPrice    DECIMAL(18,2) NOT NULL,
    Color           NVARCHAR(50)  NULL,
    Weight          DECIMAL(10,2) NULL,
    SalesCount      INT           NOT NULL DEFAULT 0,
    DiscountPercent TINYINT       NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2(3)  NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2(3)  NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Products_Categories
        FOREIGN KEY (CategoryID) REFERENCES dbo.Categories(CategoryID) ON DELETE SET NULL,
    CONSTRAINT CK_Products_Prices CHECK (SellingPrice >= 0 AND CostPrice >= 0),
    CONSTRAINT CK_Products_Discount CHECK (DiscountPercent BETWEEN 0 AND 100)
);
GO
CREATE INDEX IX_Products_StoreID ON dbo.Products(StoreID);
CREATE INDEX IX_Products_CategoryID ON dbo.Products(CategoryID);

IF OBJECT_ID('dbo.ProductImages','U') IS NOT NULL DROP TABLE dbo.ProductImages;
GO
CREATE TABLE dbo.ProductImages (
    ProductImageID  INT IDENTITY(1,1) PRIMARY KEY,
    ProductID       INT NOT NULL,
    ImageUrl        NVARCHAR(500) NOT NULL,
    SortOrder       INT NOT NULL DEFAULT 0,
    CreatedAt       DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ProductImages_Products
        FOREIGN KEY (ProductID) REFERENCES dbo.Products(ProductID) ON DELETE CASCADE
);
GO
CREATE INDEX IX_ProductImages_ProductID ON dbo.ProductImages(ProductID);





-- سایزها و موجودی (از طرح تو)
IF OBJECT_ID('dbo.ProductSizes','U') IS NOT NULL DROP TABLE dbo.ProductSizes;
GO
CREATE TABLE dbo.ProductSizes (
    ProductSizeID INT IDENTITY(1,1) PRIMARY KEY,
    ProductID     INT NOT NULL,
    Size          NVARCHAR(10) NOT NULL,
    Stock         INT NOT NULL DEFAULT 0,
    SKU           NVARCHAR(60) NULL,                -- اختیاری
    UNIQUE (ProductID, Size),
    CONSTRAINT FK_ProductSizes_Products
        FOREIGN KEY (ProductID) REFERENCES dbo.Products(ProductID) ON DELETE CASCADE,
    CONSTRAINT CK_ProductSizes_Stock CHECK (Stock >= 0)
);
GO
CREATE INDEX IX_ProductSizes_ProductID ON dbo.ProductSizes(ProductID);

------------------------------------------------------------
-- CART & WISHLIST
------------------------------------------------------------
IF OBJECT_ID('dbo.CartItems','U') IS NOT NULL DROP TABLE dbo.CartItems;
GO
CREATE TABLE dbo.CartItems (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    UserId        INT NOT NULL,
    ProductSizeID INT NOT NULL,
    Quantity      INT NOT NULL CHECK (Quantity > 0),
    CreatedAt     DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt     DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_CartItems_Users
        FOREIGN KEY (UserId) REFERENCES dbo.Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_CartItems_ProductSizes
        FOREIGN KEY (ProductSizeID) REFERENCES dbo.ProductSizes(ProductSizeID) ON DELETE CASCADE,
    CONSTRAINT UX_CartItems_User_Size UNIQUE (UserId, ProductSizeID)
);
GO
CREATE INDEX IX_CartItems_User ON dbo.CartItems(UserId);

IF OBJECT_ID('dbo.Wishlists','U') IS NOT NULL DROP TABLE dbo.Wishlists;
GO
CREATE TABLE dbo.Wishlists (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    UserId        INT NOT NULL,
    ProductSizeID INT NOT NULL,
    CreatedAt     DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Wishlists_Users
        FOREIGN KEY (UserId) REFERENCES dbo.Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_Wishlists_ProductSizes
        FOREIGN KEY (ProductSizeID) REFERENCES dbo.ProductSizes(ProductSizeID) ON DELETE CASCADE,
    CONSTRAINT UX_Wishlists_User_Size UNIQUE (UserId, ProductSizeID)
);
GO

------------------------------------------------------------
-- ORDERS, ORDER ITEMS, PAYMENTS, COUPONS
------------------------------------------------------------
IF OBJECT_ID('dbo.Orders','U') IS NOT NULL DROP TABLE dbo.Orders;
GO
CREATE TABLE dbo.Orders (
    OrderID            INT IDENTITY(1,1) PRIMARY KEY,
    Ref                NVARCHAR(50) NOT NULL UNIQUE,
    UserID             INT NOT NULL,
    Status             NVARCHAR(20) NOT NULL
                       CHECK (Status IN (N'pending',N'processing',N'cancelled',N'delivered')),
    TotalAmount        DECIMAL(18,2) NOT NULL DEFAULT 0,
    DiscountAmount     DECIMAL(18,2) NOT NULL DEFAULT 0,
    -- Snapshot آدرس ارسال (برای اینکه با تغییر آدرس کاربر، سابقه سفارش خراب نشه)
    ShipFullName       NVARCHAR(120) NULL,
    ShipLine1          NVARCHAR(200) NULL,
    ShipLine2          NVARCHAR(200) NULL,
    ShipCity           NVARCHAR(100) NULL,
    ShipStateProvince  NVARCHAR(100) NULL,
    ShipPostalCode     NVARCHAR(20)  NULL,
    ShipCountry        NVARCHAR(100) NULL,
    CreatedAt          DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt          DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Orders_Users
        FOREIGN KEY (UserID) REFERENCES dbo.Users(UserID) ON DELETE CASCADE
);
GO
CREATE INDEX IX_Orders_UserID ON dbo.Orders(UserID);

IF OBJECT_ID('dbo.OrderItems','U') IS NOT NULL DROP TABLE dbo.OrderItems;
GO
CREATE TABLE dbo.OrderItems (
    OrderItemID     INT IDENTITY(1,1) PRIMARY KEY,
    OrderID         INT NOT NULL,
    ProductID       INT NOT NULL,
    ProductSizeID   INT NULL,
    Quantity        INT NOT NULL CHECK (Quantity > 0),
    PricePerUnit    DECIMAL(18,2) NOT NULL,   -- قیمت فروش در لحظه خرید
    CostPerUnit     DECIMAL(18,2) NULL,       -- (اختیاری) برای تحلیل سود
    CONSTRAINT FK_OrderItems_Orders
        FOREIGN KEY (OrderID) REFERENCES dbo.Orders(OrderID) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products
        FOREIGN KEY (ProductID) REFERENCES dbo.Products(ProductID),
    CONSTRAINT FK_OrderItems_ProductSizes
        FOREIGN KEY (ProductSizeID) REFERENCES dbo.ProductSizes(ProductSizeID)
);
GO
CREATE INDEX IX_OrderItems_OrderID ON dbo.OrderItems(OrderID);

-- پرداخت‌ها
IF OBJECT_ID('dbo.Payments','U') IS NOT NULL DROP TABLE dbo.Payments;
GO
CREATE TABLE dbo.Payments (
    PaymentID       INT IDENTITY(1,1) PRIMARY KEY,
    OrderID         INT NOT NULL,
    Amount          DECIMAL(18,2) NOT NULL CHECK (Amount >= 0),
    Method          NVARCHAR(40)  NOT NULL,   -- e.g. 'card','wallet','cod'
    [Status]        NVARCHAR(20)  NOT NULL
                    CHECK ([Status] IN (N'pending',N'succeeded',N'failed',N'refunded')),
    TransactionRef  NVARCHAR(120) NULL,
    PaidAt          DATETIME2(3)  NULL,
    CreatedAt       DATETIME2(3)  NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Payments_Orders
        FOREIGN KEY (OrderID) REFERENCES dbo.Orders(OrderID) ON DELETE CASCADE
);
GO
CREATE INDEX IX_Payments_OrderID ON dbo.Payments(OrderID);

-- کوپن‌ها
IF OBJECT_ID('dbo.Coupons','U') IS NOT NULL DROP TABLE dbo.Coupons;
GO
CREATE TABLE dbo.Coupons (
    CouponID        INT IDENTITY(1,1) PRIMARY KEY,
    Code            NVARCHAR(50) NOT NULL UNIQUE,
    [Description]   NVARCHAR(MAX) NULL,
    DiscountType    NVARCHAR(20) NOT NULL CHECK (DiscountType IN (N'percentage',N'monetary',N'fraction')),
    DiscountValue   DECIMAL(18,4) NOT NULL,       -- درصد یا مبلغ یا ضریب
    MinOrderType    NVARCHAR(30) NULL,            -- 'items','quantity','order_cost'...
    MinOrderValue   DECIMAL(18,4) NULL,
    ExpiresAt       DATETIME2(3) NULL,
    CreatedAt       DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt       DATETIME2(3) NOT NULL DEFAULT GETUTCDATE()
);
GO

-- اتصال سفارش-کوپن (اجازه چند کوپن در یک سفارش در صورت نیاز)
IF OBJECT_ID('dbo.OrderCoupons','U') IS NOT NULL DROP TABLE dbo.OrderCoupons;
GO
CREATE TABLE dbo.OrderCoupons (
    OrderID     INT NOT NULL,
    CouponID    INT NOT NULL,
    AppliedAt   DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    PRIMARY KEY (OrderID, CouponID),
    CONSTRAINT FK_OrderCoupons_Orders
        FOREIGN KEY (OrderID) REFERENCES dbo.Orders(OrderID) ON DELETE CASCADE,
    CONSTRAINT FK_OrderCoupons_Coupons
        FOREIGN KEY (CouponID) REFERENCES dbo.Coupons(CouponID) ON DELETE CASCADE
);
GO

------------------------------------------------------------
-- REVIEWS
------------------------------------------------------------
IF OBJECT_ID('dbo.ProductReviews','U') IS NOT NULL DROP TABLE dbo.ProductReviews;
GO
CREATE TABLE dbo.ProductReviews (
    ReviewID     INT IDENTITY(1,1) PRIMARY KEY,
    UserID       INT NOT NULL,
    ProductID    INT NOT NULL,
    Remarks      NVARCHAR(MAX) NULL,
    Rating       TINYINT NOT NULL CHECK (Rating BETWEEN 0 AND 5),
    CreatedAt    DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt    DATETIME2(3) NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Reviews_Users
        FOREIGN KEY (UserID) REFERENCES dbo.Users(UserID) ON DELETE CASCADE,
    CONSTRAINT FK_Reviews_Products
        FOREIGN KEY (ProductID) REFERENCES dbo.Products(ProductID) ON DELETE CASCADE,
    CONSTRAINT UX_Reviews_User_Product UNIQUE(UserID, ProductID) -- هر کاربر یک نظر برای هر محصول
);
GO

/* =========================================================
   TRIGGERS: auto-update UpdatedAt روی جدول‌های کلیدی
   (در صورت تمایل، برای بقیه جداول هم تکرار کن)
   ========================================================= */
-- Users
IF OBJECT_ID('dbo.trg_Users_UpdatedAt','TR') IS NOT NULL DROP TRIGGER dbo.trg_Users_UpdatedAt;
GO
CREATE TRIGGER dbo.trg_Users_UpdatedAt ON dbo.Users
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE u SET UpdatedAt = GETUTCDATE()
    FROM dbo.Users u
    JOIN inserted i ON i.UserID = u.UserID;
END
GO

-- Products
IF OBJECT_ID('dbo.trg_Products_UpdatedAt','TR') IS NOT NULL DROP TRIGGER dbo.trg_Products_UpdatedAt;
GO
CREATE TRIGGER dbo.trg_Products_UpdatedAt ON dbo.Products
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p SET UpdatedAt = GETUTCDATE()
    FROM dbo.Products p
    JOIN inserted i ON i.ProductID = p.ProductID;
END
GO

-- Orders
IF OBJECT_ID('dbo.trg_Orders_UpdatedAt','TR') IS NOT NULL DROP TRIGGER dbo.trg_Orders_UpdatedAt;
GO
CREATE TRIGGER dbo.trg_Orders_UpdatedAt ON dbo.Orders
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE o SET UpdatedAt = GETUTCDATE()
    FROM dbo.Orders o
    JOIN inserted i ON i.OrderID = o.OrderID;
END
GO

-- Categories
IF OBJECT_ID('dbo.trg_Categories_UpdatedAt','TR') IS NOT NULL DROP TRIGGER dbo.trg_Categories_UpdatedAt;
GO
CREATE TRIGGER dbo.trg_Categories_UpdatedAt ON dbo.Categories
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE c SET UpdatedAt = GETUTCDATE()
    FROM dbo.Categories c
    JOIN inserted i ON i.CategoryID = c.CategoryID;
END
GO
