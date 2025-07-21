import { getDB } from '../db';


export type VPDRecord = {
  id?: number;
  greenhouse_id: number;
  timestamp: number;
  temperature: number;
  humidity: number;
  soil_moisture: number;
  vpd: number;
};

export const insertGreenhouse = async (greenhouse: any): Promise<void> => {
  const db = getDB();

  await db.runAsync(
    `INSERT INTO greenhouses (
      name, type, cover_material,
      length, width, gutter_height, roof_height,
      has_windows, window_count, window_width, window_height,
      has_skylights, skylight_count, skylight_width, skylight_height,
      ventilation_area, ventilation_percent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      greenhouse.nombre,
      greenhouse.tipo,
      greenhouse.materialCubierta,
      parseFloat(greenhouse.largo),
      parseFloat(greenhouse.ancho),
      parseFloat(greenhouse.alturaCanal),
      parseFloat(greenhouse.alturaTecho),
      greenhouse.tieneVentanas ? 1 : 0,
      parseInt(greenhouse.numeroVentanas) || 0,
      parseFloat(greenhouse.anchoVentana) || 0,
      parseFloat(greenhouse.altoVentana) || 0,
      greenhouse.tieneLucarnas ? 1 : 0,
      parseInt(greenhouse.numeroLucarnas) || 0,
      parseFloat(greenhouse.anchoLucarna) || 0,
      parseFloat(greenhouse.altoLucarna) || 0,
      parseFloat(greenhouse.ventilation_area),
      parseFloat(greenhouse.ventilation_percent),
    ]
  );
};

export const getGreenhouses = async (): Promise<any[]> => {
  const db = getDB();
  const result = await db.getAllAsync(`SELECT * FROM greenhouses ORDER BY id DESC`);
  return result;
};

export const getGreenhouseById = async (id: number): Promise<any> => {
  const db = getDB();
  const result = await db.getFirstAsync(
    `SELECT * FROM greenhouses WHERE id = ?`,
    [id]
  );
  return result;
};

export const deleteGreenhouseById = async (id: number): Promise<void> => {
  const db = getDB();
  await db.runAsync(`DELETE FROM greenhouses WHERE id = ?`, [id]);
};


export const updateGreenhouseById = async (id: number, greenhouse: any): Promise<void> => {
  const db = getDB();

  await db.runAsync(
    `UPDATE greenhouses SET
      name = ?, type = ?, cover_material = ?,
      length = ?, width = ?, gutter_height = ?, roof_height = ?,
      has_windows = ?, window_count = ?, window_width = ?, window_height = ?,
      has_skylights = ?, skylight_count = ?, skylight_width = ?, skylight_height = ?,
      ventilation_area = ?, ventilation_percent = ?
    WHERE id = ?`,
    [
      greenhouse.nombre,
      greenhouse.tipo,
      greenhouse.materialCubierta,
      parseFloat(greenhouse.largo),
      parseFloat(greenhouse.ancho),
      parseFloat(greenhouse.alturaCanal),
      parseFloat(greenhouse.alturaTecho),
      greenhouse.tieneVentanas ? 1 : 0,
      parseInt(greenhouse.numeroVentanas) || 0,
      parseFloat(greenhouse.anchoVentana) || 0,
      parseFloat(greenhouse.altoVentana) || 0,
      greenhouse.tieneLucarnas ? 1 : 0,
      parseInt(greenhouse.numeroLucarnas) || 0,
      parseFloat(greenhouse.anchoLucarna) || 0,
      parseFloat(greenhouse.altoLucarna) || 0,
      parseFloat(greenhouse.ventilation_area),
      parseFloat(greenhouse.ventilation_percent),
      id,
    ]
  );
};

// Guardar un nuevo diagnóstico de VPD
export const insertVPDRecord = async (record: VPDRecord): Promise<void> => {
  const db = getDB();
  await db.runAsync(
    `INSERT INTO vpd_records 
     (greenhouse_id, timestamp, temperature, humidity, soil_moisture, vpd) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      record.greenhouse_id,
      record.timestamp,
      record.temperature,
      record.humidity,
      record.soil_moisture,
      record.vpd,
    ]
  );
};

// Obtener todos los registros por invernadero (ordenados por fecha descendente)
export const getVPDRecordsByGreenhouseId = async (greenhouseId: number): Promise<VPDRecord[]> => {
  const db = getDB();
  const results = await db.getAllAsync(
    `SELECT * FROM vpd_records WHERE greenhouse_id = ? ORDER BY timestamp DESC`,
    [greenhouseId]
  );
  return results as VPDRecord[];
};

// (Opcional) Eliminar todos los registros de un invernadero si este se borra
export const deleteVPDRecordsByGreenhouseId = async (greenhouseId: number): Promise<void> => {
  const db = getDB();
  await db.runAsync(
    `DELETE FROM vpd_records WHERE greenhouse_id = ?`,
    [greenhouseId]
  );
};
