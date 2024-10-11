const express = require("express");
const app = express();
const path = require("path");

const http = require("http");

const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

let users = 0;
io.on("connection", function(socket){
    users++;
    console.log(`User connected! Total users: ${users}`);
    
    socket.on("send-location", function (data){
        io.emit("receive-location", {id: socket.id, ...data});
    });
    socket.on("disconnect", function(){
        users--;
        console.log(`User disconnected! Total users: ${users}`);
        io.emit("user-disconnected", socket.id);
    })
});

app.get("/", function (req, res){
    res.render("index");
});

server.listen(3000);