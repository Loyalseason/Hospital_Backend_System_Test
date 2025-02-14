import { PORT } from "./app";
import '../src/config/redisConfig';
import '../src/utils/stepWorkerUtil';
import app from "./app";

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
