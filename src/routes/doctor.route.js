import { Router } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sequelize, { doctorModel, patientModel } from "../database/db_config.js";

const doctorRouter = Router()


