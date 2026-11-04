"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const empresaRoutes_1 = __importDefault(require("./routes/empresaRoutes"));
const eventoRoutes_1 = __importDefault(require("./routes/eventoRoutes"));
const notaRoutes_1 = __importDefault(require("./routes/notaRoutes"));
const app = (0, express_1.default)();
const porta = Number(process.env.PORT || 3000);
const host = process.env.APP_HOST || '0.0.0.0';
app.set('trust proxy', true);
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/api', authRoutes_1.default);
app.use('/api', empresaRoutes_1.default);
app.use('/api', eventoRoutes_1.default);
app.use('/api', notaRoutes_1.default);
app.get('*', (_req, res) => res.sendFile(path_1.default.join(__dirname, '../public/index.html')));
app.listen(porta, host, () => {
    console.log(`Servidor disponível em http://localhost:${porta}`);
    if (host === '0.0.0.0') {
        console.log('A API também aceita conexões de outros computadores da rede local.');
    }
});
