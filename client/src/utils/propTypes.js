import PropTypes from 'prop-types';

export const userPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['super_admin', 'lawyer', 'client']).isRequired,
  avatar: PropTypes.string,
});

export const trendPropType = PropTypes.shape({
  value: PropTypes.number.isRequired,
  isPositive: PropTypes.bool.isRequired,
});