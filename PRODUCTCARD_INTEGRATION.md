# ProductCard Component Integration Guide

## Overview

The ProductCard component has been successfully integrated into the page builder system, allowing users to easily add product displays to any page through both the visual editor and Storybook.

## Features

### ✅ Core Functionality

- **Visual Product Display**: Shows product image, name, description, and price
- **Add to Cart Integration**: Fully integrated with the shopping cart system
- **Error Handling**: Graceful fallback with custom canvas when images fail to load
- **Responsive Design**: Works well on all screen sizes using Material-UI components
- **Cart Context Safety**: Handles cases where CartContext might not be available

### ✅ Page Builder Integration

- **Drag & Drop**: Can be dragged from component palette to page canvas
- **Live Editing**: Properties can be edited through the visual props editor
- **Nested Properties**: Supports editing product.name, product.price, etc.
- **JSON Editor**: Advanced users can edit component props as JSON

### ✅ Storybook Stories

- **Multiple Variants**: Default, out of stock, long names, no image, expensive products
- **Grid Layout**: Example showing multiple products in a responsive grid
- **Isolated Testing**: Stories work with and without CartProvider

## Usage in Page Builder

### Adding a ProductCard Component

1. **Through Visual Builder**:

   - Navigate to Admin → Page Management
   - Create or edit a page
   - Switch to "Visual Builder" tab
   - Find "Product Card" in the "E-commerce" category
   - Drag to canvas or click "Add" button

2. **Through JSON Editor**:
   ```json
   {
     "id": "unique-id",
     "componentId": "product-card",
     "props": {
       "product": {
         "id": 1,
         "name": "Product Name",
         "description": "Product description",
         "price": "99.99",
         "image": "https://example.com/image.jpg",
         "stock": 10
       }
     }
   }
   ```

### Editable Properties

- **Product Name** (text): The display name of the product
- **Description** (textarea): Detailed product description
- **Price** (text): Product price (supports both string and number formats)
- **Image URL** (text): URL to the product image
- **Stock** (number): Available quantity

### Example Component Configuration

```javascript
{
  id: 'product-card-1',
  componentId: 'product-card',
  props: {
    product: {
      id: 1,
      name: 'Premium Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: '199.99',
      image: 'https://via.placeholder.com/400x300/4caf50/ffffff?text=Headphones',
      stock: 25
    }
  }
}
```

## Component Props

| Prop                  | Type          | Required | Description               |
| --------------------- | ------------- | -------- | ------------------------- |
| `product`             | Object        | Yes      | Product data object       |
| `product.id`          | String/Number | No       | Unique product identifier |
| `product.name`        | String        | Yes      | Product name              |
| `product.description` | String        | No       | Product description       |
| `product.price`       | String/Number | Yes      | Product price             |
| `product.image`       | String        | No       | Product image URL         |
| `product.stock`       | Number        | No       | Available stock quantity  |

## Error Handling

### Missing Images

When a product image fails to load or is not provided:

- Component automatically hides the broken image
- Shows a custom canvas with a shrug emoji (🤷🏽‍♀️)
- Displays "Image Not Found" text with proper styling

### Missing CartContext

If CartContext is not available (shouldn't happen in normal usage):

- "Add to Cart" button becomes disabled
- Console warning is logged
- Component still renders the product information

## Integration Points

### 1. ComponentRegistry

The ProductCard is registered in `/src/components/pageBuilder/ComponentRegistry.js` with:

- Component ID: `'product-card'`
- Category: `'E-commerce'`
- Icon: `'🛍️'`
- Default props with sample product data
- Editable props configuration for nested properties

### 2. CartContext Integration

- Uses `useCart()` hook from `CartContext`
- Safely handles missing context
- Adds products to cart with proper quantity management

### 3. Page Rendering

- Works seamlessly in `PageRenderer` component
- Maintains cart functionality when rendered on public pages
- Props are properly merged from defaults and user customizations

## Testing

### Storybook Stories

Available at `http://localhost:6006` under "Product/ProductCard":

- **Default**: Basic product card example
- **OutOfStock**: Shows out of stock product
- **WithoutCartProvider**: Tests without cart context
- **WithLongProductName**: Tests text overflow handling
- **NoImage**: Tests image fallback functionality
- **ExpensiveProduct**: Tests high-value products
- **ProductGrid**: Shows multiple products in grid layout

### Test Page

A test page with multiple ProductCard components is available at:
`http://localhost:3000/pages/test-product-showcase`

### Manual Testing Steps

1. Create a new page in Page Management
2. Add ProductCard components using visual builder
3. Edit product properties through props editor
4. Preview the page
5. Test "Add to Cart" functionality
6. Verify cart updates correctly

## Utilities

### Helper Functions

Located in `/src/utils/productCardHelpers.js`:

- `createProductCardComponent(product)`: Creates a properly formatted component object
- `createProductShowcasePage(products, title)`: Generates a complete page with multiple products
- `sampleProducts`: Array of sample product data for testing

### Usage Example

```javascript
import {
  createProductCardComponent,
  sampleProducts,
} from "../utils/productCardHelpers";

const productComponent = createProductCardComponent(sampleProducts[0]);
// Add to page components array
```

## Future Enhancements

### Potential Improvements

- **Product Variants**: Support for size, color options
- **Ratings/Reviews**: Star ratings and review counts
- **Sale/Discount Badges**: Special pricing indicators
- **Quick View**: Modal with detailed product information
- **Wishlist Integration**: Save for later functionality
- **Inventory Warnings**: Low stock notifications

### Development Notes

- Component follows Material-UI design patterns
- Responsive grid layout works well with 3-4 products per row
- Image aspect ratio is optimized for 4:3 (400x300)
- Price formatting handles both string and numeric inputs
- Canvas fallback provides consistent user experience

## Troubleshooting

### Common Issues

1. **ProductCard not appearing in component palette**

   - Check ComponentRegistry.js import
   - Verify component is properly exported
   - Restart development server

2. **Add to Cart not working**

   - Ensure CartProvider wraps the application
   - Check browser console for context errors
   - Verify product has required fields (id, name, price)

3. **Image not loading**

   - Verify image URL is accessible
   - Check for CORS issues
   - Canvas fallback should appear automatically

4. **Props not updating**
   - Check nested property paths (product.name, etc.)
   - Verify ComponentPropsEditor handles nested props
   - Try using JSON editor for complex updates

### Debug Steps

1. Open browser developer tools
2. Check console for error messages
3. Verify component props in React DevTools
4. Test in Storybook for isolated component behavior

## Conclusion

The ProductCard component integration is now complete and production-ready. Users can:

- Add product cards to any page through the visual page builder
- Customize all product properties through an intuitive interface
- Leverage the shopping cart functionality seamlessly
- Test components in isolation using Storybook

The integration follows best practices for component architecture, error handling, and user experience.
