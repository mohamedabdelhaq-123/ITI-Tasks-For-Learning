const http = require('http');
const fs = require('fs');
const path = require('path');

const inventoryPath = path.join(__dirname,'inventory.json')

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // home page
  if (method === 'GET' && url === '/') {
    let data = '';
    const readStream = fs.createReadStream(inventoryPath, 'utf-8');
    
    readStream.on('data', (chunk) => { data += chunk; });
    
    readStream.on('end', () => {
      const inventory = JSON.parse(data);
      
      let html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Inventory</title>
          <link rel="stylesheet" href="/style.css">  <!-- browser send another request to get style.css -->
        </head>
        <body>
          <h1>Inventory List</h1> 
          <br>
          <table border="1">
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Category</th>
            </tr>
      `;
      
      for (let prod of inventory) {
        html += `
          <tr>
            <td>${prod.item}</td>
            <td>${prod.quantity}</td>
            <td>${prod.category}</td>
          </tr>
        `;
      }
      
      html += `</table></body></html>`;
      
      res.writeHead(200, { 'Content-Type': 'text/html' }); // standard mime and 200 is success status code
      res.end(html);
    });
  }
  
  // astronomy page
  else if (method === 'GET' && url === '/astronomy') {
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Astronomy</title><link rel="stylesheet" href="/style.css"></head>
      <body>
        <h1>Astronomy</h1>
        <br>
        <img src="/astronomy.jpeg" width="500">             <!-- browser send another request to get the image-->
        <p>Astronomy is the study of space and stars.</p>
      </body>
      </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }
  
  // serbal page 
  else if (method === 'GET' && url === '/serbal') {
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Serbal</title><link rel="stylesheet" href="/style.css"></head>
      <body>
        <h1>Serbal</h1>
        <br>
        <img src="/mountains.jpeg" width="500">
        <p>Mount Serbal is a mountain in the southern Sinai.</p>
      </body>
      </html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }
  
  // add Inventory
  else if (method === 'POST' && url === '/inventory') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    
    req.on('end', () => {
      const newItem = JSON.parse(body);
      
      const data = fs.readFileSync(inventoryPath, 'utf-8');
      const inventory = JSON.parse(data);
      
      
      newItem.id = inventory.length + 1;
      inventory.push(newItem);
      
      const writeStream = fs.createWriteStream(inventoryPath);
      writeStream.write(JSON.stringify(inventory));
      writeStream.end();
      
      res.writeHead(201, { 'Content-Type': 'application/json' }); // standard mime for data
      res.end(JSON.stringify(newItem));
    });
  }
  
  // serve Static Files (css and images) and link with the html
  else {
    const filePath = path.join(__dirname, 'public', url);
    const ext = path.extname(filePath); // to get extension of file

    const mimeTypes = {  // to ensure that we follow the standard
      '.css': 'text/css',
      '.jpeg': 'image/jpeg'
    };

    
    if (mimeTypes[ext]) { // if valid extension
      const readStream = fs.createReadStream(filePath);
      
      readStream.on('open', () => {
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] });
        readStream.pipe(res);
      });
    } 
    else {  // If not valid type
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Page Not Found</h1><a href="/">Go Home</a>');
    }
  }
});

server.listen(3003, () => {
  console.log(`Server running on http://localhost:3003`);
});