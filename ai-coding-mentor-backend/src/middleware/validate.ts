import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export function validate(schema: ZodObject<any>, source: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      req[source] = data;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: "Validation error",
          details: (error as any).errors?.map((e: any) => ({
            field: e.path?.join(".") || "",
            message: e.message || "",
          })) || [],
        });
      }
      next(error);
    }
  };
}
