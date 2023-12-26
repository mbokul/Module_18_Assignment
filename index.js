const app = require('./app');

require('dotenv').config();
const Port = process.env.Running_Port;

app.listen(Port, () => {
   console.log(`Server listening on port ${Port}`);
});
