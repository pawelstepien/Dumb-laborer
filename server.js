const http = require('http');
const qs = require('querystring');
const fs = require('fs');
const sizeOf = require('image-size');

const html = content => {
    return `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <div></div>
        </head>
        <body> 
            ${content}
        </body> 
    </html>`;
};

const form = `
<form method="POST">
    <label for="content">Assets location</label>
    <input type="text" name="content">
    <input type="submit" value="Send">
</form>
`;

const getDimensions = (file) => {
    const dimensions = sizeOf(file);
    console.log('aa', file)
    return dimensions.width + 'x' + dimensions.height;
}


const server = http.createServer((req, res) => {
    if(req.method == "POST") {
        req.setEncoding('utf-8');
        req.on('data', data => {
            const path = qs.parse(data).content;
            fs.readdir(path, (error, files) =>{
                if(error){
                    console.log('Can\'t access location\n', error);
                } else {
                    res.write(
                        html(form + 
                        `<ul>
                            ${files.filter(file => {return file.match(/\.png|\.jpg|\.jpeg|\.gif/) !== null})
                            .map(file => {return `<li>${file + ' ' + getDimensions(path + '\\' + file)}</li>`})
                            .join('')}
                        </ul>`)
                    );
                }
            });
        })

    } else if (req.method == "GET") {
        res.write(html(form));
    }
    
    // fs.readFile('./file.html/', (error, data) => {
    //     res.writeHead(200, 'text/html');
        

    //     res.write();

    //     res.end();
    // });

});
server.listen(1337);
console.log('Server is running');
