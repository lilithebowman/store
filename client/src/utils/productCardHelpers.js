// Utility functions for ProductCard components
export const createProductCardComponent = (product) => {
    return {
        id: `product-card-${product.id || Date.now()}`,
        componentId: 'product-card',
        props: {
            product: {
                id: product.id || Date.now(),
                name: product.name || 'Untitled Product',
                description: product.description || 'No description available',
                price: typeof product.price === 'number' ? product.price.toFixed(2) : product.price || '0.00',
                image: product.image || 'https://via.placeholder.com/400x300/cccccc/ffffff?text=No+Image',
                stock: product.stock || 0
            }
        }
    };
};

export const createProductShowcasePage = (products, title = 'Product Showcase') => {
    const components = [
        {
            id: 'header-text',
            componentId: 'text-block',
            props: {
                content: `<h1>${title}</h1><p>Discover our amazing collection of products!</p>`
            }
        }
    ];

    // Add product cards
    products.forEach((product, index) => {
        if (index > 0 && index % 3 === 0) {
            // Add a spacer every 3 products for better layout
            components.push({
                id: `spacer-${index}`,
                componentId: 'spacer',
                props: { height: 40 }
            });
        }
        components.push(createProductCardComponent(product));
    });

    return components;
};

export const sampleProducts = [
    {
        id: 1,
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
        price: '199.99',
        image: 'https://via.placeholder.com/400x300/1976d2/ffffff?text=Headphones',
        stock: 25
    },
    {
        id: 2,
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracker with heart rate monitoring, GPS, and smartphone integration.',
        price: '299.99',
        image: 'https://via.placeholder.com/400x300/4caf50/ffffff?text=Smart+Watch',
        stock: 15
    },
    {
        id: 3,
        name: 'Ergonomic Laptop Stand',
        description: 'Adjustable aluminum laptop stand designed for improved posture and airflow.',
        price: '49.99',
        image: 'https://via.placeholder.com/400x300/ff9800/ffffff?text=Laptop+Stand',
        stock: 50
    },
    {
        id: 4,
        name: 'USB-C Hub',
        description: 'Multi-port USB-C hub with HDMI, USB 3.0, and fast charging capabilities.',
        price: '79.99',
        image: 'https://via.placeholder.com/400x300/9c27b0/ffffff?text=USB+Hub',
        stock: 30
    },
    {
        id: 5,
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
        price: '29.99',
        image: 'https://via.placeholder.com/400x300/f44336/ffffff?text=Charger',
        stock: 100
    },
    {
        id: 6,
        name: 'Bluetooth Mechanical Keyboard',
        description: 'Compact mechanical keyboard with RGB backlighting and wireless connectivity.',
        price: '149.99',
        image: 'https://via.placeholder.com/400x300/607d8b/ffffff?text=Keyboard',
        stock: 20
    }
];
