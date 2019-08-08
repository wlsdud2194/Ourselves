module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
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
    group: {
      field: 'group',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  }, {
    tableName: 'teacher',
    timestamps: false,
  });

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.Member , {
      foreignKey: 'memberId',
    });
  };

  Teacher.signUp = (data) => Teacher.create({
    memberId: data.id,
    group: data.group,
  });

  Teacher.getTeacherById = (memberId) => Teacher.findOne({
    where: {
      memberId,
    },
    raw: true,
  })

  return Teacher;
}