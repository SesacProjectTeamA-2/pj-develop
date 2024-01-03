const Complain = (Sequelize, DataTypes) => {
  const complain = Sequelize.define(
    'tb_complain',
    {
      cSeq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: '신고 시퀀스',
      },
      cDetail: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '신고내용',
      },
      cuSeq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '신고한 사람',
      },
    },
    {
      tableName: 'tb_complain',
      freezeTableName: true,
      timestamps: true,
    }
  );
  return complain;
};

module.exports = Complain;
