const express = require("express");
const authRoutes = require("./routes/authRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/clientes", clienteRoutes);
app.use("/login", authRoutes);
app.get("/", (req, res) =>{
    res.json({mensagem: "API funcionando"});
});
module.exports = app;