import express from 'express';
import { query } from '../lib/db.js';
import { mapCityRow } from '../lib/format.js';

const router = express.Router();

router.get('/cities', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM cities ORDER BY city_name ASC`);
    return res.json(rows.map(mapCityRow));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/cities/:id', async (req, res) => {
  try {
    const { rows } = await query(`SELECT * FROM cities WHERE id = $1`, [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ error: 'City not found' });
    }
    return res.json(mapCityRow(rows[0]));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/cities', async (req, res) => {
  try {
    const {
      state_id,
      city_name,
      district,
      lat,
      lng,
      source,
      tds,
      ph,
      turbidity,
      fluoride,
      nitrate,
      arsenic,
      risk,
      reason,
      contaminants,
      updated_at,
    } = req.body;

    if (!state_id || !city_name || !district) {
      return res.status(400).json({ error: 'state_id, city_name and district are required' });
    }

    const { rows } = await query(
      `
        INSERT INTO cities (
          state_id, city_name, district, lat, lng, source, tds, ph, turbidity, fluoride, nitrate, arsenic, risk, reason, contaminants, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `,
      [
        state_id,
        city_name,
        district,
        lat,
        lng,
        source || 'Mixed',
        tds || 0,
        ph || 0,
        turbidity || 0,
        fluoride || 0,
        nitrate || 0,
        arsenic || 0,
        risk || 'Moderate',
        reason || '',
        contaminants || [],
        updated_at || new Date().toISOString(),
      ]
    );

    return res.status(201).json(mapCityRow(rows[0]));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/cities/:id', async (req, res) => {
  try {
    const { state_id, city_name, district, lat, lng, source, tds, ph, turbidity, fluoride, nitrate, arsenic, risk, reason, contaminants, updated_at } = req.body;

    const { rows } = await query(
      `
        UPDATE cities
        SET 
          state_id = COALESCE($1, state_id),
          city_name = COALESCE($2, city_name),
          district = COALESCE($3, district),
          lat = COALESCE($4, lat),
          lng = COALESCE($5, lng),
          source = COALESCE($6, source),
          tds = COALESCE($7, tds),
          ph = COALESCE($8, ph),
          turbidity = COALESCE($9, turbidity),
          fluoride = COALESCE($10, fluoride),
          nitrate = COALESCE($11, nitrate),
          arsenic = COALESCE($12, arsenic),
          risk = COALESCE($13, risk),
          reason = COALESCE($14, reason),
          contaminants = COALESCE($15, contaminants),
          updated_at = COALESCE($16, updated_at)
        WHERE id = $17
        RETURNING *
      `,
      [state_id, city_name, district, lat, lng, source, tds, ph, turbidity, fluoride, nitrate, arsenic, risk, reason, contaminants, updated_at, req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'City not found' });
    }

    return res.json(mapCityRow(rows[0]));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/cities/:id', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM cities WHERE id = $1', [req.params.id]);
    if (!rowCount) {
      return res.status(404).json({ error: 'City not found' });
    }
    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
