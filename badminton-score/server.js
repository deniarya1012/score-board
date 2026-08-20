const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Jadikan folder 'public' sebagai tempat file HTML
app.use(express.static('public'));

// Menyimpan data skor dan nama tim di server
let gameData = {
    teamA: "TIM A",
    teamB: "TIM B",
    scoreA: 0,
    scoreB: 0
};

io.on('connection', (socket) => {
    console.log('Sebuah device terhubung');
    
    // Kirim data terbaru saat ada device yang baru terhubung
    socket.emit('updateData', gameData);

    // Menerima perintah update skor dari remote
    socket.on('updateScore', (data) => {
        if (data.team === 'A') gameData.scoreA = data.score;
        if (data.team === 'B') gameData.scoreB = data.score;
        io.emit('updateData', gameData); // Sebarkan ke semua layar
    });

    // Menerima perintah update nama tim dari remote
    socket.on('updateName', (data) => {
        if (data.team === 'A') gameData.teamA = data.name;
        if (data.team === 'B') gameData.teamB = data.name;
        io.emit('updateData', gameData); // Sebarkan ke semua layar
    });
});

// Jalankan server di port 3000
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan. Buka http://localhost:${PORT} di komputer ini.`);
});