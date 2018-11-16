import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)

export const create = function(req, res){
    let { fechaCompromiso, fechaCumplimiento, descripcion, activo, responsable, minuta, notas } = req.body
    connection.query(`INSERT INTO Compromisos (ID, FECHA_COMPROMISO, FECHA_CUMPLIMIENTO, DESCRIPCION, ACTIVO, RESPONSABLE, MINUTA, NOTAS) VALUES (null, ?, ?, ?, ?, ?, ?, ?)`, [fechaCompromiso, fechaCumplimiento, descripcion, activo, responsable, minuta, notas], (err, results) => {
        if (err) {
            res.status(400)
            res.send({})
        }
        else {
            res.json({ success: true})
        }
    })
}

export const put = function(req, res){
    let id = req.params.id
    let { fechaCompromiso, fechaCumplimiento, descripcion, activo, responsable, minuta, notas } = req.body
    connection.query(`UPDATE Compromisos SET FECHA_COMPROMISO = ?, DESCRIPCION = ?, ACTIVO = ?, RESPONSABLE = ?, MINUTA = ?, FECHA_CUMPLIMIENTO = ?, NOTAS = ? WHERE id = ? `, [fechaCompromiso, descripcion, activo, responsable, minuta, fechaCumplimiento, notas, id], (err, results) => {
        if (err) {
            res.status(400)
            res.json({})
        }
        else {
            res.json({ success: true})
        }
    })
}

export const mine = function(req, res) {
    const { user } = req.session

    if(user === undefined){
        return res.json([{}])
    }

    const currentUser = user.id;
    let { fechaCompromiso, descripcion, activo, responsable, minuta } = req.body
    connection.query(`SELECT 
        c.ID as id, 
        c.FECHA_COMPROMISO as fechaCompromiso, 
        c.FECHA_CUMPLIMIENTO as fechaCumplimiento,
        c.DESCRIPCION as descripcion,
        c.ACTIVO as activo, 
        activos.ACTIVO_NAME as nombreActivo, 
        activos.SUBDIRECCION_NAME as subdireccion,
        c.RESPONSABLE as responsable, 
        c.MINUTA as minuta,
        c.NOTAS as notas
      FROM Compromisos AS c 
      LEFT JOIN 
       ( 
         SELECT DISTINCT ACTIVO_NAME, ACTIVO_ID, SUBDIRECCION_NAME FROM FieldWellMapping
       ) AS activos 
       ON c.ACTIVO = activos.ACTIVO_ID 
       WHERE c.RESPONSABLE = ?`, [currentUser], (err, results) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(results)
        }
    })
}

export const collection = function(req, res) {
    connection.query(`SELECT 
      c.ID as id, 
      c.FECHA_COMPROMISO as fechaCompromiso, 
      c.FECHA_CUMPLIMIENTO as fechaCumplimiento, 
      c.DESCRIPCION as descripcion,
      c.ACTIVO as activo, 
      activos.ACTIVO_NAME as nombreActivo, 
      activos.SUBDIRECCION_NAME as subdireccion,
      c.RESPONSABLE as responsable, 
      Users.username as nombreResponable,
      c.MINUTA as minuta,
      c.NOTAS as notas
    FROM Compromisos AS c 
    LEFT JOIN Users ON c.RESPONSABLE = Users.id 
    LEFT JOIN 
       ( 
         SELECT DISTINCT ACTIVO_NAME, ACTIVO_ID, SUBDIRECCION_NAME FROM FieldWellMapping
       ) AS activos 
       ON c.ACTIVO = activos.ACTIVO_ID `, (err, results) => {
        res.json(results)
    })
}

export const get = function(req, res) {
    if (req.params.id) {
        connection.query(`SELECT 
          c.ID as id, 
          c.FECHA_COMPROMISO as fechaCompromiso, 
          c.FECHA_CUMPLIMIENTO as fechaCumplimiento, 
          c.DESCRIPCION as descripcion,
          c.ACTIVO as activo, 
          activos.ACTIVO_NAME as nombreActivo, 
          c.RESPONSABLE as responsable, 
          Users.username as nombreResponable,
          c.MINUTA as minuta,
          c.NOTAS as notas
        FROM Compromisos AS c 
        LEFT JOIN Users ON c.RESPONSABLE = Users.id 
        LEFT JOIN 
           ( 
             SELECT DISTINCT ACTIVO_NAME, ACTIVO_ID FROM FieldWellMapping
           ) AS activos 
           ON c.ACTIVO = activos.ACTIVO_ID 
        WHERE c.ID = ?`, [req.params.id], (err, results) => {
            res.json(results[0])
        })
    }else {
        res.status(400)
        res.send({})
    }
}