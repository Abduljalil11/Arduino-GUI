const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const PORT = process.env.PORT || 3030;

app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
  
io.on('connection', (socket) => {   
    console.log('a user connected');
});

SerialPort.list().then(function(ports){
    ports.map((p) => {
        if(p.manufacturer === 'wch.cn'){
            const port = new SerialPort({path: p.path, baudRate: 9600 })
        
            const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
        
            parser.on('data', (data)=>{
                const arr = data.split(" ")
                io.emit('arr', arr)
                console.log(arr)
                // var plotly = require("plotly")("Abduljalil11", "lQFhGtEgAsQlef3ju1MB")
                // var info = [{y:[data[0]], type: "line"}];
                // var layout = {fileopt : "overwrite", filename : "live graph"};

                // plotly.plot(info, layout, (err, msg) => {
                //     if (err) return console.log(err);
                //     console.log(msg);
                // })
            })
        }
    })
})


  
server.listen(PORT, () => {
    console.log('listening on *:3030');
});

// app.listen(PORT, () => {
//     console.log(`server started on port ${PORT}`);
// });
