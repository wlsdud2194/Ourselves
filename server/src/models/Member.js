module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    id: {
      field: 'id',
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
    },
    pw: {
      field: 'pw',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    name: {
      field: 'name',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    auth: {
      field: 'auth',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    school: {
      field: 'school',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    profileImg: {
      field: 'profile_img',
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phoneNumber: {
      field: 'phone_number',
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  }, {
    tableName: 'member',
    timestamps: false,
  });

  Member.associate = (models) => {
    Member.hasMany(models.Study , {
      foreignKey: 'memberId',
    });
    Member.hasMany(models.StudyPerson , {
      foreignKey: 'memberId',
    });
    Member.hasMany(models.Student , {
      foreignKey: 'memberId',
    });
    Member.hasMany(models.Teacher , {
      foreignKey: 'memberId',
    });
  };

  Member.getMemberById = (id) => Member.findOne({
    attrubutes: ['id', 'name', 'auth', 'school', 'profileImg', 'phoneNumber'],
    where: {
      id,
    },
    raw: true,
  });

  Member.login = (id, pw) => Member.findOne({
    attrubutes: ['id', 'name', 'auth', 'school', 'profileImg', 'phoneNumber'],
    where: {
      id,
      pw,
    },
    raw: true,
  });

  Member.signUp = (data) => Member.create({
    id: data.id,
    pw: data.pw,
    name: data.name,
    auth: data.auth,
    school: data.school,
    profileImg: data.profileImg,
    phoneNumber: data.phoneNumber,
  });

  Member.getStudentById = (memberId) => sequelize.query(`
    SELECT a.id AS "id", a.name AS "name", a.school AS "school", a.profile_img AS "profileImg", a.phone_number AS "phoneNumber", b.idx AS "studentIdx", b.grade AS grade, b.class AS class
    FROM member AS a
    LEFT JOIN student AS b
    ON a.id = b.member_id
    WHERE a.id = :memberId
  `, {
    type: sequelize.QueryTypes.SELECT,
    replacements: {
      memberId,
    },
  });

  Member.getStudents = () => sequelize.query(`
    SELECT a.id AS "id", a.name AS "name", a.school AS "school", a.profile_img AS "profileImg", a.phone_number AS "phoneNumber", b.idx AS "studentIdx", b.grade AS grade, b.class AS class
    FROM member AS a
    LEFT JOIN student AS b
    ON a.id = b.member_id
  `, {
    type: sequelize.QueryTypes.SELECT,
  });

  return Member;
};
