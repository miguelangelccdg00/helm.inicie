import app from './index';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

if (!app) {
  console.error('Error: Express app is undefined. Check the export in index.ts');
  process.exit(1);
}

app.listen(PORT, () => 
{
  console.log(` Servidor corriendo en el puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Error starting server:', err);
});