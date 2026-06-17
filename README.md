# Shopping App (React Native / Expo)

A React Native app built with Expo that implements:

- **Product List Page** — fetches products from the API, shows Profile & Cart icons (top-right), cart badge count, tap-to-detail navigation.
- **Product List Error Page** — distinguishes "No Internet Connection" from API/server failures, with a Retry button.
- **Product Detail Page** — full product info (name, price, rating, image, description) with a Favorite icon (top-right) that adds/removes the item from the cart.
- **Cart Page** — lists saved/favorited items with a running total and remove option.
- **Profile Page** — static menu list (no actions attached, per spec), editable profile picture via the pencil icon (camera or gallery), persisted across app restarts using AsyncStorage, with permission-denied handling.

## Project Structure

```
ShoppingApp/
├── App.js                          # Root component (providers + navigation)
├── app.json                        # Expo config (permissions, plugin config)
├── babel.config.js
├── package.json
└── src/
    ├── api/
    │   └── products.js             # fetch logic + error categorization
    ├── context/
    │   └── CartContext.js          # global cart state, persisted via AsyncStorage
    ├── components/
    │   ├── HeaderIcons.js          # profile + cart icons w/ badge (top-right)
    │   └── ProductCard.js          # list item card
    ├── screens/
    │   ├── ProductListScreen.js
    │   ├── ProductDetailScreen.js
    │   ├── CartScreen.js
    │   └── ProfileScreen.js
    └── navigation/
        └── AppNavigator.js         # React Navigation native stack
```

## Setup

1. **Prerequisites:** Node.js (18+), npm, and the Expo Go app on your phone (or an Android/iOS simulator).

2. Install dependencies:
   ```bash
   cd ProductApp
   npm install
   ```

3. Run the app:
   ```bash
   npx expo start
   ```
   Scan the QR code with Expo Go (Android) or the Camera app (iOS), or press `a` / `i` to launch an emulator/simulator.

## How each requirement is implemented

| Requirement | Implementation |
|---|---|
| Product list from API | `src/api/products.js` calls `https://api.npoint.io/866592d4df655060f42c`; rendered via `FlatList` in `ProductListScreen.js` |
| Profile icon → Profile page (top-right) | `HeaderIcons.js`, wired via `navigation.setOptions({ headerRight: ... })` in `ProductListScreen.js` |
| Cart icon → Cart page (top-right) | Same `HeaderIcons.js` component |
| Cart item count badge | `CartContext.cartCount`, rendered as a badge over the cart icon |
| Tap product → Detail page | `onPress` on `ProductCard` navigates to `ProductDetail` with the product as a param |
| No internet → "No Internet Connection" | `NetInfo.fetch()` check in `products.js` before calling the API; also catches network-level fetch failures |
| API failure → specific error message | Non-OK HTTP responses throw `AppError` with the status code/text; JSON parse failures throw a distinct message |
| Product detail: name, price, rating, image | `ProductDetailScreen.js` |
| Favorite icon (top-right) adds to cart | `headerRight` button in `ProductDetailScreen.js`, calls `toggleCartItem` |
| Same icon removes from cart if already added | `toggleCartItem` checks `isInCart` and adds or removes accordingly; icon swaps between 🤍 and ❤️ |
| Profile: menus with no action | Static `MENU_ITEMS` array rendered as plain `View`s (not buttons) in `ProfileScreen.js` |
| Pencil icon to update picture | `editButton` in `ProfileScreen.js`, opens an action sheet/alert to choose Camera or Library |
| Picture persists across app restarts | Saved to `AsyncStorage` under `@product_app/profile_picture`, reloaded on mount |
| Camera permission denied → error message | `ImagePicker.requestCameraPermissionsAsync()` checked; shows an `Alert` if not granted |

## Notes / Possible Extensions

- Currently "Favorite" and "Cart" are the same concept (adding a product to the cart). If you want a **separate** Favorites list distinct from the Cart, I can split `CartContext` into two contexts/stores.
- The Profile page email/name are hardcoded placeholders — wire them to real auth/user data if/when available.
- Network detection uses `@react-native-community/netinfo`; on web (Expo web) this gracefully reports `isConnected` based on the browser's online status.
- Icons are emoji-based for zero extra asset/icon-font dependencies. Swap in `@expo/vector-icons` (already bundled with Expo) if you prefer crisp vector icons — happy to convert these on request.
