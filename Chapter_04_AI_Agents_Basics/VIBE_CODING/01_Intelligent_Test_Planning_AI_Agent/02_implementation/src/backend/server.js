import { app } from "./app.js";
import { loadLocalEnv } from "./env.js";

loadLocalEnv();

const PORT = process.env.TP_PORT || 3001;
app.listen(PORT, () => console.log(`Backend http://localhost:${PORT}`));