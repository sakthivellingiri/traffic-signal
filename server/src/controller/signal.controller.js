import {
  createSignal,
  getAllSignals,
  getSignalById,
  updateSignal,
  deleteSignal,
} from "../services/signal.service.js";
import { signalService } from "../config/constant.js";

export const handleCreateSignal = async (req, res) => {
  try {
    const newSignal = await createSignal(req.body);
    res.status(201).json({ success: true, data: newSignal });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleGetAllSignals = async (req, res) => {
  try {
    const signals = await getAllSignals();
    res.json({ success: true, data: signals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleGetSignalById = async (req, res) => {
  try {
    const signal = await getSignalById(req.params.id);
    if (signal) {
      return res.json({ success: true, data: signal });
    }
    res
      .status(404)
      .json({ success: false, error: signalService.MESSAGES.SIGNAL_NOT_FOUND });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleUpdateSignal = async (req, res) => {
  try {
    const updatedSignal = await updateSignal(req.params.id, req.body);
    if (updatedSignal) {
      return res.json({ success: true, data: updatedSignal });
    }
    res
      .status(404)
      .json({ success: false, error: signalService.MESSAGES.SIGNAL_NOT_FOUND });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const handleDeleteSignal = async (req, res) => {
  try {
    await deleteSignal(req.params.id);
    res
      .status(204)
      .json({ success: true, message: signalService.MESSAGES.SIGNAL_DELETED });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
