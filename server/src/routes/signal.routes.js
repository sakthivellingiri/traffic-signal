import express from "express";
import {
  handleCreateSignal,
  handleDeleteSignal,
  handleGetAllSignals,
  handleGetSignalById,
  handleUpdateSignal,
} from "../controller/signal.controller.js";

const signalRouter = express.Router();

signalRouter.post("/", handleCreateSignal);
signalRouter.get("/", handleGetAllSignals);
signalRouter.get("/:id", handleGetSignalById);
signalRouter.put("/:id", handleUpdateSignal);
signalRouter.delete("/:id", handleDeleteSignal);

export default signalRouter;
