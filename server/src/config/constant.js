export const signalService = {
    SIGNAL_TYPES: ['Red', 'Green', 'Yellow'],
    MESSAGES: {
        INVALID_DATA: 'Invalid data or signal type',
        SIGNAL_UPDATED: 'Signal updated',
        MACHINE_ID_NOT_FOUND: 'Machine ID not found',
        DB_ERROR: 'Database error',
        SIGNAL_NOT_FOUND:"Signal not found",
        SIGNAL_DELETED:"Signal deleted successfully",
        MACHINE_ID_ALREADY_EXISTS:"Machine Id already exists",
        SIGNAL_TYPE_VALIDATION:"Invalid signal_type. Allowed values: Red, Green, Yellow"
    }
};

export const mqttService = {
    SUBSCRIPTION:"signal-data",
}

export const sockerService = {
    SOCKET_EMMIT_EVENT:"signalUpdated"
}

