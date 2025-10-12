import { Elysia } from "elysia";

export const app = new Elysia();

app.get("/", () => "Hello AutoKeeper");

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
