import app from './index';
import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config({ path: path.join(process.cwd(), 'apps', 'api-shared-helm', 'claves.env') });


const PORT = process.env.PORT || 3009;

app.listen(PORT, () =>
{
  console.log(` Servidor corriendo en el puerto ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});