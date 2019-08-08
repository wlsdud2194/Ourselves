module.exports = (sequelize, DataTypes) => {
  const Study = sequelize.define('Study', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    title: {
      field: 'title',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    description: {
      field: 'description',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    startTerm: {
      field: 'start_term',
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTerm: {
      field: 'end_term',
      type: DataTypes.DATE,
      allowNull: false,
    },
    startTime: {
      field: 'start_time',
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      field: 'end_time',
      type: DataTypes.TIME,
      allowNull: false,
    },
    personnel: {
      field: 'personnel',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: { // 0: 모집중, 1: 스터디 진행중
      field: 'status',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    locationIdx: {
      field: 'location_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'study',
    timestamps: false,
  });

  Study.associate = (models) => {
    Study.belongsTo(models.Member , {
      foreignKey: 'memberId',
    });
    Study.belongsTo(models.Location , {
      foreignKey: 'locationIdx',
    });
    Study.hasMany(models.StudyPerson , {
      foreignKey: 'studyIdx',
    });
    Study.hasMany(models.File , {
      foreignKey: 'studyIdx',
    });
  };

  Study.getStudies = () => Study.findAll({
    attributes: [
      'idx',
      'memberId',
      'title',
      'description',
      [sequelize.fn('to_char', sequelize.col('start_term'), 'yyyy-mm-dd hh24:mi:ss'), 'startTerm'],
      [sequelize.fn('to_char', sequelize.col('end_term'), 'yyyy-mm-dd hh24:mi:ss'), 'endTerm'],
      'startTime',
      'endTime',
      'personnel',
      'status',
      'locationIdx',
    ],
    where: {
      status: 0,
    },
    raw: true,
  });

  Study.getPastStudies = () => Study.findAll({
    attributes: [
      'idx',
      'memberId',
      'title',
      'description',
      [sequelize.fn('to_char', sequelize.col('start_term'), 'yyyy-mm-dd hh24:mi:ss'), 'startTerm'],
      [sequelize.fn('to_char', sequelize.col('end_term'), 'yyyy-mm-dd hh24:mi:ss'), 'endTerm'],
      'startTime',
      'endTime',
      'personnel',
      'status',
      'locationIdx',
    ],
    where: {
      status: 1,
    },
    raw: true,
  });

  Study.getStudyByMemberId = (memberId) => Study.findAll({
    attributes: [
      'idx',
      'memberId',
      'title',
      'description',
      [sequelize.fn('to_char', sequelize.col('start_term'), 'yyyy-mm-dd hh24:mi:ss'), 'startTerm'],
      [sequelize.fn('to_char', sequelize.col('end_term'), 'yyyy-mm-dd hh24:mi:ss'), 'endTerm'],
      'startTime',
      'endTime',
      'personnel',
      'status',
      'locationIdx',
    ],
    where: {
      memberId,
    },
    raw: true,
  });

  Study.getStudyByIdx = (idx) => Study.findOne({
    attributes: [
      'idx',
      'memberId',
      'title',
      'description',
      [sequelize.fn('to_char', sequelize.col('start_term'), 'yyyy-mm-dd hh24:mi:ss'), 'startTerm'],
      [sequelize.fn('to_char', sequelize.col('end_term'), 'yyyy-mm-dd hh24:mi:ss'), 'endTerm'],
      'startTime',
      'endTime',
      'personnel',
      'status',
      'locationIdx',
    ],
    where: {
      idx,
    },
    raw: true,
  });

  Study.makeStudy = (memberId, data) => Study.create({
    memberId,
    title: data.title,
    description: data.description,
    startTerm: data.startTerm,
    endTerm: data.endTerm,
    startTime: data.startTime,
    endTime: data.startTime,
    personnel: data.personnel,
    locationIdx: data.locationIdx,
  });

  Study.closeStudy = (idx) => Study.update({
    status: 1,
  }, {
    where: {
      idx,
    },
  });

  return Study;
}