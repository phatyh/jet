import { Request } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const currentUserId = (req: Request): number => {
    const token = <string>req.headers['authorization'].replace('Bearer ', '');

    const { userId } = <any>jwt.verify(token, config.jwtSecret);

    return userId;
}