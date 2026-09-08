# No-Commerce

No-Commerce is a server-rendered e-commerce application built with Node.js, Express, EJS, and MongoDB. It has two user flows:

- **Customer:** account creation, login, product browsing, sorting, product details, cart, checkout, addresses, profile management, and orders.
- **Owner/Admin:** owner account creation, login, dashboard, product creation, product editing/deletion, inventory statistics, and logout.

## Tech Stack

- **Runtime:** Node.js
- **Backend framework:** Express 5
- **Templating:** EJS
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT stored in cookies
- **Password security:** bcrypt
- **Uploads:** Multer
- **Request parsing:** `express.json()` and `express.urlencoded()`
- **Frontend:** HTML/EJS, CSS, and browser-side JavaScript
- **Other packages:** `dotenv`, `cookie-parser`, `jsonwebtoken`, `@countrystatecity/*`

## Prerequisites

- Node.js and npm
- MongoDB running locally
- MongoDB database connection available at:

```text
mongodb://localhost:27017/no-commerce
```

## Installation and Run

```bash
npm install
npm start
```

The project currently does not define an `npm start` script. Start it directly with:

```bash
node main.js
```

For development, Nodemon is installed and can be run with:

```bash
npx nodemon main.js
```

Set a port before starting the server. For example, in a `.env` file:

```env
PORT=3000
```

Then open `http://localhost:3000` in a browser.

> `config/mongoose-connection.js` currently uses the local MongoDB URL directly. `MONGO_URI` is loaded through dotenv but is not currently used by the connection code.

## Folder Structure

```text
.
├── main.js                       # Express app entry point and route mounting
├── package.json                  # Project metadata and dependencies
├── NOTE.txt                      # Personal Node.js/Express learning notes
├── config/
│   ├── mongoose-connection.js    # MongoDB/Mongoose connection
│   ├── multerConfig.js           # User image upload configuration
│   └── multerConfig2.js          # Product image upload configuration
├── model/
│   ├── usermodel.js              # Customer schema
│   ├── ownermodel.js             # Owner/admin schema
│   ├── productmodel.js           # Product schema
│   └── userLocationmodel.js      # Customer address schema
├── route/
│   ├── userRoute.js              # Customer auth and product listing
│   ├── ownerRoute.js             # Owner auth and dashboard operations
│   ├── productCreateRoute.js     # Product creation
│   ├── productInfoRoute.js       # Owner product details/edit/delete
│   ├── productOverviewRoute.js   # Customer product details
│   ├── productHandleByuserRoute.js # Cart, checkout, and orders
│   ├── userProfileRoute.js       # Customer profile and profile image
│   ├── userProfileSettingRoute.js # Customer settings and addresses
│   ├── ownerProfileRoute.js      # Owner profile statistics
│   └── myOrdersRoute.js           # Separate sample order API (not mounted)
├── views/                        # EJS pages
├── public/
│   ├── css/                      # Page-specific stylesheets
│   ├── js/                       # Browser-side scripts
│   ├── images/                   # Uploaded customer images
│   ├── productImage/              # Uploaded product images
│   └── API/                      # Public API/static assets
└── README.md
```

## Application Flow

### Customer Flow

1. Visit `/` and create an account or log in.
2. After login, browse products at `/login/product/:id`.
3. Open a product overview, add it to the cart, or begin checkout.
4. Add an address in profile settings if checkout needs one.
5. Confirm payment and view saved orders.

### Owner Flow

1. Visit `/admin` and create an owner account or log in.
2. Manage products from `/admin/dashboard/:id`.
3. Add products at `/owner/:id/productsCreate`.
4. View owner statistics at `/admin/dashboard/:id/profile`.
5. Edit or delete products from the product information flow.

## Pages and Views

| View | Purpose |
|---|---|
| `index.ejs` | Customer login and signup screen. `public/js/index.js` toggles both forms. |
| `product.ejs` | Customer product catalogue with optional low-to-high/high-to-low sorting. |
| `productOverview.ejs` | Customer-facing product details, seller information, cart, and buy actions. |
| `cart.ejs` | Shows products currently stored in the customer's cart and allows removal or checkout. |
| `buyPage.ejs` | Checkout page for one product or the cart, including saved addresses. |
| `myOrders.ejs` | Displays order information passed by the order routes. |
| `userProfile.ejs` | Customer profile information and profile picture update UI. |
| `userSetting.ejs` | Customer account details, password, and address management. |
| `owner.ejs` | Owner/admin login and signup screen. |
| `ownerdashbord.ejs` | Owner dashboard with owned products and product actions. |
| `ownerProfile.ejs` | Owner statistics such as total products, stock, and inventory value. |
| `productsCreate.ejs` | Form for creating a product with an image upload. |
| `productInfo.ejs` | Owner product information page with edit and delete actions. |
| `popup.ejs` | Shared success/error message page with a navigation button. |

## Route Reference

### Customer Routes: `route/userRoute.js`

Mounted at `/` in `main.js`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Shows customer login/signup, or redirects an authenticated customer to the catalogue. |
| `POST` | `/create` | Creates a customer account and uploads a profile image. Passwords are hashed with bcrypt. |
| `POST` | `/login` | Validates credentials, creates the `token` cookie, and redirects to the catalogue. |
| `GET` | `/login/product/:id` | Loads all products for a logged-in customer. |
| `POST` | `/login/product/sort/:id` | Sorts products by price and renders the catalogue. |
| `POST` | `/user/:id/logout` | Clears the customer authentication cookie. |

### Owner Routes: `route/ownerRoute.js`

Mounted at `/admin`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin` | Shows owner login/signup, or redirects an authenticated owner to the dashboard. |
| `POST` | `/admin/create/account` | Creates an owner account with a hashed password. |
| `POST` | `/admin/login` | Validates owner credentials and creates the `ownerToken` cookie. |
| `GET` | `/admin/dashboard/:id` | Loads the owner's products for the dashboard. |
| `POST` | `/admin/dashboard/:id/allProduct/delete` | Deletes all products owned by an owner and removes product images. |
| `POST` | `/admin/:id/logout` | Clears the owner authentication cookie. |

### Product Management Routes

`route/productCreateRoute.js` is mounted at `/owner/:id/productsCreate`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/owner/:id/productsCreate` | Shows the product creation form. |
| `POST` | `/owner/:id/productsCreate/done` | Uploads a product image, creates the product, and links it to the owner. |

`route/productInfoRoute.js` is mounted at `/admin`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/:ownerid/:id/info` | Shows product details for the owner. |
| `POST` | `/admin/Side/products/delete/:id` | Removes a product, its image, cart references, and owner reference. |
| `POST` | `/admin/Side/product/edit/:id` | Updates product price, discount, and stock. |

### Customer Product, Cart, Checkout, and Order Routes

`route/productOverviewRoute.js` is mounted at `/login/product`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/login/product/:userId/:productId` | Shows product details and seller information to a logged-in customer. |

`route/productHandleByuserRoute.js` is mounted at `/`.

| Method | Path | Description |
|---|---|---|
| `POST` | `/login/:userid/product/:productid/addToCart` | Adds a product ID to the customer's cart. |
| `GET` | `/login/:userid/cart` | Loads the customer's cart. |
| `POST` | `/:userid/remove/cart/:productid` | Removes a product from the cart. |
| `POST` | `/login/:userid/product/:productid/buyPage` | Opens checkout for one product. |
| `POST` | `/login/:id/buyCart` | Opens checkout for all cart items. |
| `POST` | `/login/:userid/product/:productid/:paid/done` | Validates the address, creates order entries, decreases stock, and redirects to orders. |
| `GET` | `/login/:id/order` | Displays orders stored on the customer document. |

### Customer Profile Routes

`route/userProfileRoute.js` is mounted at `/login/profile/id`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/login/profile/id/:userId` | Shows the customer profile. |
| `POST` | `/login/profile/id/:userId/picture/update` | Replaces the profile picture and removes the old file. |

`route/userProfileSettingRoute.js` is also mounted at `/login/profile/id`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/login/profile/id/:id/setting` | Shows account settings and saved addresses. |
| `POST` | `/login/profile/id/:id/setting/updateProfile` | Updates username and email after password verification. |
| `POST` | `/login/profile/id/:id/setting/updatePassword` | Verifies and hashes a new password. |
| `POST` | `/login/profile/id/:id/address/upload` | Adds a saved address. |
| `POST` | `/login/profile/id/:id/location/:locationId/remove` | Removes a saved address. |

### Owner Profile Route

`route/ownerProfileRoute.js` is mounted at `/admin/dashboard`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/admin/dashboard/:id/profile` | Calculates and shows owner product, stock, and inventory-value statistics. |

### Additional Order API

`route/myOrdersRoute.js` defines `/my-orders`, `/order-details/:orderId`, `/track-order/:orderId`, `/cancel-order/:orderId`, `/review-order/:orderId`, and `/order-stats`. However, this router is not imported or mounted in `main.js`, and its data is currently hard-coded sample data. The active order page is `/login/:id/order` from `productHandleByuserRoute.js`.

## Data Models

### User (`model/usermodel.js`)

Stores username, email, hashed password, phone number, profile image, cart product IDs, order entries, and saved location IDs.

### Owner (`model/ownermodel.js`)

Stores owner credentials, phone number, GSTIN, and product IDs belonging to the owner.

### Product (`model/productmodel.js`)

Stores name, description/details, price, discount, stock count, panel color, image filename, and the owning admin ID.

### Location (`model/userLocationmodel.js`)

Stores pincode, country, state, city, street address, and the related customer ID.

## Upload Components

- `multerConfig.js` saves customer profile images in `public/images`.
- `multerConfig2.js` saves product images in `public/productImage`.
- Both upload configurations generate random filenames using Node's `crypto` module.

## Authentication

- Customer login uses a signed JWT in the `token` cookie.
- Owner login uses a signed JWT in the `ownerToken` cookie.
- Customer and owner route files contain their own `isUser` or `isOwner` middleware.
- The current JWT secret is hard-coded as `BSandox`; move it to an environment variable before production use.

## Frontend Assets

- `public/css/` contains page-specific stylesheets such as `product.css`, `cart.css`, `owner.css`, `userprofile.css`, and `payment.css`.
- `public/js/index.js` switches between login and signup forms.
- `public/js/ownerdashbord.js` controls the owner dashboard delete modal.
- Other page scripts are available under `public/js/`; some are currently empty or minimal.
- `public/images/` and `public/productImage/` are runtime upload directories.

## Important Notes

- There are no automated tests configured yet; `npm test` currently exits with a placeholder error.
- The application expects MongoDB to be running before `main.js` starts.
- `PORT` should be provided through `.env` because `main.js` calls `app.listen(process.env.PORT)`.
- Authentication and several route handlers should validate that the cookie user ID matches the URL ID before production deployment.
- The checkout code decreases stock and stores order data, but there is no external payment gateway integration yet.
- The `myOrdersRoute.js` router is currently disconnected from the main application and uses sample data.

## License

The project metadata currently declares the `ISC` license in `package.json`.
