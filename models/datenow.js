module.exports  = function (sequelize, DataTypes) {
    var Datenow = sequelize.define("Datenow", {
        zipCode: DataTypes.STRING,
        API: DataTypes.STRING,
        APIId: DataTypes.STRING,
        name: DataTypes.STRING,
        popularity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
    return Datenow;
};

// module.exports = db;