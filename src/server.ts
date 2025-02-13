import { PORT } from "./app";
import app from "./app";

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
