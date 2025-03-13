import { pool } from "../config/db.js";
import { emitEventToClient } from "../config/socket.js";
import { signalService ,sockerService} from "../config/constant.js";

export const VALID_SIGNAL_TYPES = signalService.SIGNAL_TYPES;


export const createSignal = async (signalData) => {
  let { machine_id, signal_type, signal_data } = signalData;

    // Check if the machine already exists
    const existingMachine = await pool.query(
      `SELECT machine_id FROM signals WHERE machine_id = $1`,
      [machine_id]
    );
  
    if (existingMachine.rows.length > 0) {
      throw new Error(signalService.MESSAGES.MACHINE_ID_ALREADY_EXISTS);
    }
  

  // Validate signal_type
  if (!Array.isArray(signal_type) || signal_type.some(type => !VALID_SIGNAL_TYPES.includes(type))) {
    throw new Error(signalService.MESSAGES.SIGNAL_TYPE_VALIDATION);
  }

  // Set default signal_data if it's invalid
  if (!signal_data || signal_data !== "null") {
    signal_data = "null";
  }

  const result = await pool.query(
    `INSERT INTO signals (machine_id, signal_type, signal_data)
     VALUES ($1, $2, $3) RETURNING *`,
    [machine_id, signal_type, signal_data]
  );

  return result.rows[0];
};


export const getAllSignals = async () => {
  const result = await pool.query("SELECT * FROM signals");
  return result.rows;
};

export const getSignalById = async (id) => {
  const result = await pool.query("SELECT * FROM signals WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateSignal = async (id, signalData) => {
  const { signal_type, signal_data } = signalData;

  const result = await pool.query(
    `UPDATE signals
     SET signal_type = $1, signal_data = $2, updated_at = CURRENT_TIMESTAMP
     WHERE id = $3 RETURNING *`,
    [signal_type, signal_data, id]
  );

  return result.rows[0];
};

export const deleteSignal = async (id) => {
  await pool.query("DELETE FROM signals WHERE id = $1", [id]);
};

// Updated query to fetch by machine_id
export const getSignalByMachineId = async (machine_id) => {
  const result = await pool.query(
    "SELECT * FROM signals WHERE machine_id = $1",
    [machine_id]
  );
  return result.rows[0];
};

export const handleIncomingSignal = async (signalData) => {
  const { machine_id, signal_data } = signalData;

  if (!machine_id || !VALID_SIGNAL_TYPES.includes(signal_data)) {
    return { error: signalService.MESSAGES.INVALID_DATA };
  }

  try {
    const existingSignal = await getSignalByMachineId(machine_id);

    if (existingSignal) {
      const updatedSignal = await updateMachineSignal(machine_id, signal_data);
      emitEventToClient(sockerService.SOCKET_EMMIT_EVENT, updatedSignal);
      // console.log("updatedSignal", updatedSignal);
      return {
        message: signalService.MESSAGES.SIGNAL_UPDATED,
        data: updatedSignal,
      };
    }

    return { error: signalService.MESSAGES.MACHINE_ID_NOT_FOUND };
  } catch (err) {
    return { error: signalService.MESSAGES.DB_ERROR, details: err.message };
  }
};

// Update only signal_data based on machine_id
export const updateMachineSignal = async (machine_id, signal_data) => {
  const cleanSignalData =
    typeof signal_data === "object" ? signal_data.signal_data : signal_data;

  const result = await pool.query(
    `UPDATE signals
       SET signal_data = $1, updated_at = CURRENT_TIMESTAMP
       WHERE machine_id = $2 RETURNING *`,
    [cleanSignalData, machine_id]
  );

  return result.rows[0];
};
