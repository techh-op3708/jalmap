import express from 'express';
import { query } from '../lib/db.js';
import { mapStateRow } from '../lib/format.js';

const router = express.Router();

router.get('/states', async (req, res) => {
  try {
    const { rows: states } = await query(`
      SELECT * FROM states
      ORDER BY name ASC
    `);

    const stateIds = states.map((state) => state.id);

    let cities = [];
    if (stateIds.length) {
      const { rows } = await query(
        `
          SELECT * FROM cities
          WHERE state_id = ANY($1)
          ORDER BY city_name ASC
        `,
        [stateIds]
      );
      cities = rows;
    }

    const grouped = cities.reduce((acc, city) => {
      acc[city.state_id] = acc[city.state_id] || [];
      acc[city.state_id].push(city);
      return acc;
    }, {});

    const payload = states.map((state) => mapStateRow(state, grouped[state.id] || []));
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/states/:id', async (req, res) => {
  try {
    const { rows } = await query(
      `
        SELECT * FROM states
        WHERE id = $1
      `,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'State not found' });
    }

    const { rows: cities } = await query(
      `SELECT * FROM cities WHERE state_id = $1 ORDER BY city_name ASC`,
      [req.params.id]
    );

    return res.json(mapStateRow(rows[0], cities));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/states', async (req, res) => {
  try {
    const { id, name, lat, lng, overallRisk } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'id and name are required' });
    }

    const { rows } = await query(
      `
        INSERT INTO states (id, name, lat, lng, overall_risk)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id)
        DO UPDATE SET name = EXCLUDED.name, lat = EXCLUDED.lat, lng = EXCLUDED.lng, overall_risk = EXCLUDED.overall_risk
        RETURNING *
      `,
      [id, name, lat, lng, overallRisk || 'Moderate']
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/states/:id', async (req, res) => {
  try {
    const { name, lat, lng, overallRisk } = req.body;

    const { rows } = await query(
      `
        UPDATE states
        SET name = COALESCE($1, name), lat = COALESCE($2, lat), lng = COALESCE($3, lng), overall_risk = COALESCE($4, overall_risk)
        WHERE id = $5
        RETURNING *
      `,
      [name, lat, lng, overallRisk, req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: 'State not found' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/states/:id', async (req, res) => {
  try {
    const { rowCount } = await query('DELETE FROM states WHERE id = $1', [req.params.id]);
    if (!rowCount) {
      return res.status(404).json({ error: 'State not found' });
    }
    return res.json({ success: true, id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
