
const [, , rawMethod, rawResource, ...params] = process.argv;

if (!rawMethod || !rawResource) {
    console.error('Usage: npm start <METHOD> <RESOURCE> [PARAMS]');
    console.error('Examples:');
    console.error('  npm start GET products');
    console.error('  npm start GET products/<Id>');
    console.error('  npm start POST products <title> <price> <category>');
    console.error('  npm start DELETE products/<Id>');
    process.exit(1);
}

const method = rawMethod.toUpperCase();
const resource = rawResource.toLowerCase();

const URL = 'https://fakestoreapi.com/products';

async function request(url = URL, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function showOutput(output) {
    output.forEach(product => {
        console.log(`Product: ${product.title}  ||  ID:${product.id}`);
        console.log(`Category: ${product.category}`);
        console.log(`Price: $${product.price}`);
        console.log('.\n.');
    });
}

async function main() {

    var output = [];
    switch (method) {
        case 'GET':
            if (params.length != 0){
                throw new Error('GET products does not take any parameters');
            }

            if (resource === 'products') {
                output = [...await request()];
                console.log('Success: Retrieved all products\n');
            } else if (resource.startsWith('products/')) {
                const productId = resource.split('/')[1];
                output.push(await request(`${URL}/${productId}`));
                console.log(`Success: Retrieved product by ID: ${productId}\n`);
            } else {
                throw new Error(`Unsupported resource for GET: ${resource}`);
            }
        break;
        case 'POST':
            if (params.length != 3){
                throw new Error('POST products requires 3 parameters: <title> <price> <category>');
            }

            if (resource !== 'products') {
                throw new Error(`Unsupported resource for POST: ${resource}`);
            }

            const [title, rawPrice, category] = params;
            const price = parseFloat(rawPrice);
            if (isNaN(price) || price <= 0) {
                throw new Error('Price must be a positive number');
            }

            const newProduct = {
                title,
                price: parseFloat(price),
                category
            };

            output.push(await request(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            }));
            console.log('Success in creating new product :\n');
        break;
        case 'DELETE':
            if (params.length != 0) {
              throw new Error("DELETE products does not take any parameters");
            }

            if (resource.startsWith("products/")) {
              const productId = resource.split("/")[1];
              output.push(await request(`${URL}/${productId}`, {
                method: "DELETE"
              }));
              console.log(`Success: DELETED product by ID: ${productId}\n`);
            } else {
              throw new Error(`ID was not provided for DELETE, use format: products/<productId>`);
            }
        break;
        default:
            throw new Error(`Unsupported method: ${method}`);
    }
    showOutput(output);
}

main().catch(error => {
    console.error(error.message);
});