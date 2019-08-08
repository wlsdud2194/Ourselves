module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
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
    grade: {
      field: 'grade',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class: {
      field: 'class',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'student',
    timestamps: false,
  });

  Student.associate = (models) => {
    Student.belongsTo(models.Member , {
      foreignKey: 'memberId',
    });
  };

  Student.signUp = (data) => Student.create({
    memberId: data.id,
    grade: data.grade,
    class: data.class,
  });

  Student.getStudentById = (memberId) => Student.findOne({
    where: {
      memberId,
    },
    raw: true,
  });

  return Student;
}