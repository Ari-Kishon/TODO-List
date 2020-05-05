const http = require('http');

const tasks = [];

const getTasks = () => {
    return new Promise((resolve, reject) => {
        resolve(JSON.stringify(tasks));
    }).then((tasks) => {
        return tasks
    });
}

const pushTask = (text) => {
    tasks.push({
        id: Date.now(),
        task: {
            text,
            complete: false
        }
    })
}

const addTask = (text) => {
    new Promise((resolve, reject) => {
        pushTask(text);
        resolve(text);
    }).then((text) => {
        console.log(`"${text}" added successfully`)
    })
}

async function requestHandler(method, data) {
    switch (method) {
        case 'GET':
            return await getTasks();
        case 'POST':
            await addTask(data);
            break;
        default:
            response.write(`invalid method`);
    }
}

const server = http.createServer();
server.on('request', (request, response) => {
    response.setHeader('Content-Type', 'application/json');
    let body = "";
    request.on('data', function (data) {
        body += data;
    })
    request.on('end', function () {
        requestHandler(request.method, body).then((res) => response.end(res));
    });

});
server.listen(8080);