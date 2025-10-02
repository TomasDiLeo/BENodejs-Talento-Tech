
const args = process.argv.slice(2);

async function getAllProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    const products = await response.json();
    for (let product of products) {        
        const { id, title, price, category } = product;
        console.log(
            `${title} || ID: ${id}\n`,
            `-------------------------\n`,
            `Price: $${price}\n`,
            `Category: ${category}\n`
        );
    }
}

async function getProductById(productId) {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
    if (response.ok) {
        const product = await response.json();
        console.log(product);
    } else {
        console.log(`Producto con id ${productId} no encontrado.`);
    }
}

async function createProduct(title, price, category) {
    const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, price: Number(price), category })
    });
    const result = await response.json();
    console.log(result);
}

async function deleteProduct(productId) {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    console.log(result);
}

function parseCommand(args) {
    if (args.length === 2 && args[0] === 'GET' && args[1] === 'products') {
        getAllProducts();
    } else if (
        args.length === 3 &&
        args[0] === 'GET' &&
        args[1] === 'products' &&
        !isNaN(Number(args[2]))
    ) {
        getProductById(args[2]);
    } else if (
        args.length === 5 &&
        args[0] === 'POST' &&
        args[1] === 'products'
    ) {
        createProduct(args[2], args[3], args[4]);
    } else if (
        args.length === 3 &&
        args[0] === 'DELETE' &&
        args[1] === 'products' &&
        !isNaN(Number(args[2]))
    ) {
        deleteProduct(args[2]);
    } else {
        console.log('Comando no reconocido. Usa: GET products, GET products/<productId>, POST products <title> <price> <category>, DELETE products/<productId>');
    }
}

parseCommand(args);
