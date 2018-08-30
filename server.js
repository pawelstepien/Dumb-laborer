const http = require('http');
const qs = require('querystring');
const fs = require('fs');
const sizeOf = require('image-size');

const html = content => {
    return `
    <html>
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <style type="text/css">
                * {
                    margin: 0;
                    padding: 0;
                }
                #resuls {
                    width: 100vw;
                }
                .half-col {
                    width: 50%;
                }
            </style>
        </head>
        <body> 
            ${content}
        </body> 
    </html>`;
};

const createTable = (html, css) => {
    return  `
    <table id="results">
        <tr>
            <td id="html-col" class="half-col">
                ${html}
            </td>
            <td id="css-col" class="half-col">
                ${css}
            </td>
        <tr>
    </table>`
}

const form = `
<form method="POST">
    <label for="content">Assets location</label>
    <input type="text" name="content">
    <input type="submit" value="Send">
</form>
`;



const getDimensions = file => {
    const dimensions = sizeOf(file);
    return {width: dimensions.width, height: dimensions.height};
}

const generateTag = file => {
    let id  = file.split('/');
    id = id[id.length - 1].split('\.')[0];
    return `&lt;img src="${file}" id="${id}"&gt;`;
}

const generateRuleset = file => {
    let id  = file.split('/');
    id = id[id.length - 1].split('\.')[0];
    const dimensions = getDimensions(file);
    return `#${id} {\n
        @include sizeOnExpand(${dimensions.width}, ${dimensions.height});\n
    }`;
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
                            .map(file => {return `<li>${generateTag(path + '/' + file)}</li>`})
                            .join('')}
                        </ul>`)
                    );
                }
            });
        })

    } else if (req.method == "GET") {
        res.write(html(form));
    }
});

server.listen(1337);
console.log('Server is running');
