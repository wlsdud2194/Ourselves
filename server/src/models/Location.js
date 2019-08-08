module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    place: {
      field: 'place',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName: 'location',
    timestamps: false,
  });

  Location.associate = (models) => {
    Location.hasMany(models.Study , {
      foreignKey: 'locationIdx',
    });
  };

  Location.getLocationByIdx = (idx) => Location.findOne({
    where: {
      idx,
    },
    raw: true,
  });

  Location.getAvailableLocation = () => sequelize.query(`
    SELECT a.idx AS idx, a.place AS place, b.idx AS status, TO_CHAR(b.end_term, 'yyyy-mm-dd hh24:mi:ss') AS "endTerm"
    FROM location AS a
    LEFT JOIN study AS b
    ON a.idx = b.location_idx
    ORDER BY a.idx ASC
  `, {
    type: sequelize.QueryTypes.SELECT,
  });

  return Location;
}