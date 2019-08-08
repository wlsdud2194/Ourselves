module.exports = (sequelize, DataTypes) => {
  const StudyPerson = sequelize.define('StudyPerson', {
    idx: {
      field: 'idx',
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studyIdx: {
      field: 'study_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memberId: {
      field: 'member_id',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    status: { // 0: 참여안함, 1: 참여함
      field: 'status',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    tableName: 'study_person',
    timestamps: false,
  });

  StudyPerson.associate = (models) => {
    StudyPerson.belongsTo(models.Study , {
      foreignKey: 'studyIdx',
    });
    StudyPerson.belongsTo(models.Member , {
      foreignKey: 'memberId',
    });
  };

  StudyPerson.checkMember = (studyIdx, memberId) => StudyPerson.findOne({
    where: {
      studyIdx,
      memberId,
    },
    raw: true,
  });

  StudyPerson.getStudyPersonByIdx = (studyIdx) => StudyPerson.findAll({
    where: {
      studyIdx,
    },
    raw: true,
  });

  StudyPerson.getStudyPersonByMemberId = (memberId) => StudyPerson.findAll({
    where: {
      memberId,
    },
    raw: true,
  });

  StudyPerson.applyStudy = (memberId, studyIdx) => StudyPerson.create({
    studyIdx,
    memberId,
  });

  return StudyPerson;
}