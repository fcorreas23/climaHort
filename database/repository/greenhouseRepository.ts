import { getDB } from '../db';

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

