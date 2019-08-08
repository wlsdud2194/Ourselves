module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileType: {
      field: 'file_type',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    url: {
      field: 'url',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    studyIdx: {
      field: 'study_idx',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'file',
    timestamps: false,
  });

  File.associate = (models) => {
    File.belongsTo(models.Study , {
      foreignKey: 'studyIdx',
    });
  };

  File.createFile = (fileType, url) => File.create({
    fileType,
    url,
  });

  File.getFileByStudyIdx = (studyIdx) => File.findAll({
    attributes: ['url'],
    where: {
      studyIdx,
    },
    raw: true,
  });

  File.matchingFile = (idx, url) => File.update({
    studyIdx: idx,
  }, {
    where: {
      url,
    },
  });

  return File;
}