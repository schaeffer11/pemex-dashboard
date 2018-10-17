import db from '../lib/db'
import appConfig from '../../app-config.js'
const connection = db.getConnection(appConfig.users.database)

exports.create = function(req, res){
    let { fechaRevision, descripcion, activo, responsable, minuta } = req.body
    connection.query(`INSERT INTO Compromisos (ID, FECHA_REVISON, DESCRIPCION, ACTIVO, RESPONSABLE, MINUTA) VALUES (null, ?, ?, ?, ?, ?)`, [fechaRevision, descripcion, activo, responsable, minuta], (err, results) => {
        if (err) {
            res.json({ success: false})
        }
        else {
            res.json({ success: true})
        }
    })
}

exports.complete = function(req, res){
    let { fechaCumplimiento } = req.body
    connection.query(`UPDATE  Compromisos FECHA_CUMPLIMIENTO = ? `, [fechaCumplimiento, descripcion], (err, results) => {
        if (err) {
            res.json({ success: false})
        }
        else {
            res.json({ success: true})
        }
    })
}

exports.mine = function(req, res) {
    const { user } = req.session

    if(user === undefined){
        return res.json([{}])
    }

    const currentUser = user.id;
    let { fechaRevision, descripcion, activo, responsable, minuta } = req.body
    connection.query(`SELECT 
        c.ID as id, 
        c.FECHA_REVISON as fechaRevision, 
        c.DESCRIPCION as descripcion,
        c.ACTIVO as activo, 
        activos.ACTIVO_NAME as nombreActivo, 
        c.RESPONSABLE as responsable, 
        c.MINUTA as minuta 
      FROM Compromisos AS c 
      LEFT JOIN 
       ( 
         SELECT DISTINCT ACTIVO_NAME, ACTIVO_ID FROM FieldWellMapping
       ) AS activos 
       ON c.ACTIVO = activos.ACTIVO_ID 
       WHERE c.RESPONSABLE = ? `, [currentUser], (err, results) => {
        if (err) {
            res.json(err)
        }
        else {
            res.json(results)
        }
    })
}

exports.get = function(req, res) {
    connection.query(`SELECT 
      c.ID as id, 
      c.FECHA_REVISON as fechaRevision, 
      c.DESCRIPCION as descripcion,
      c.ACTIVO as activo, 
      activos.ACTIVO_NAME as nombreActivo, 
      c.RESPONSABLE as responsable, 
      Users.username as nombreResponable,
      c.MINUTA as minuta 
    FROM Compromisos AS c 
    LEFT JOIN Users ON c.RESPONSABLE = Users.id 
    LEFT JOIN 
       ( 
         SELECT DISTINCT ACTIVO_NAME, ACTIVO_ID FROM FieldWellMapping
       ) AS activos 
       ON c.ACTIVO = activos.ACTIVO_ID `, (err, results) => {
        res.json(results)
    })
}