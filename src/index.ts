import { Hono } from "hono"
import { getMode } from "inngest/helpers/env"
import { serve } from "inngest/hono"
import { functions, inngest } from "./inngest"

const app = new Hono()

app.on(
  ["GET", "PUT", "POST"],
  "/api/inngest",
  serve({
    client: inngest,
    functions
  })
)

app.post("/api/create", async (c) => {
  inngest["mode"] = getMode({ env: c.env })
  inngest.setEventKey(inngest["eventKey"])
  const body = await c.req.json()
  await inngest.send({
    name: "demo/event.sent",
    data: {
      message: body.message
    }
  })
  return c.json({ message: "Hello Hono!" })
})

export default app
