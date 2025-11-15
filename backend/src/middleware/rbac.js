const checkPermission = (action) => {
  return (req, res, next) => {
    const { role } = req.user;

    const permissions = {
      'view_restaurants': ['ADMIN', 'MANAGER', 'MEMBER'],
      'create_order': ['ADMIN', 'MANAGER', 'MEMBER'],
      'place_order': ['ADMIN', 'MANAGER'],
      'cancel_order': ['ADMIN', 'MANAGER'],
      'update_payment': ['ADMIN']
    };

    if (!permissions[action]?.includes(role)) {
      return res.status(403).json({
        success: false,
        error: 'You do not have permission to perform this action'
      });
    }

    next();
  };
};

const filterByCountry = (req, res, next) => {
  const { role, country } = req.user;

  if (role === 'ADMIN') {
    req.countryFilter = null; // Admin can see all
  } else {
    req.countryFilter = country; // Others limited to their country
  }

  next();
};

module.exports = { checkPermission, filterByCountry };