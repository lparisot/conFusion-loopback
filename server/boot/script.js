function createUser(app, user, role) {
  var Customer = app.models.Customer;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  Customer.findOrCreate(
    { where: { username: user.username, email: user.email } },
    {
      username: user.username,
      email: user.email,
      password: user.password
    },
    function(err, user) {
      if (err) throw (err);

      if (role === 'admin') {
        // Create the admin role if needed
        Role.findOrCreate(
          {where: { name: 'admin' }},
          { name: 'admin' },
          function(err, role) {
            if (err) throw (err);
            // and assign admin role to user
            RoleMapping.findOrCreate(
              {where: { roleId: role.id, principalId: user.id }},
              { roleId: role.id, principalId: user.id, principalType: RoleMapping.USER },
              function(err, roleMapping) {
                if (err) return console.log(err);
                console.log("admin Role assigned to user " + user.username);
              }
            );
          }
        );
      }
    }
  );
}

module.exports = function(app) {
  var MongoDB = app.dataSources.MongoDB;

  MongoDB.automigrate('Customer', function(err) {
    if (err) throw (err);

    createUser(
      app,
      {username: 'admin', email: 'admin@admin.com', password: 'admin'},
      'admin'
    );
    createUser(
      app,
      {username: 'lpa', email: 'lpa@ici.com', password: 'azerty'},
      ''
    );
  });
};
