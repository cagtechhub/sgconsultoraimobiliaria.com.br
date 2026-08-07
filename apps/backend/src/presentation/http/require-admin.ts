import type { NextFunction, Request, Response } from "express"

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const expected = process.env.ADMIN_API_TOKEN
  if (!expected) {
    res.status(500).json({ error: "admin_token_not_configured" })
    return
  }

  const header = req.header("authorization") ?? ""
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : ""
  if (!token || token !== expected) {
    res.status(401).json({ error: "unauthorized" })
    return
  }

  next()
}
