import React from 'react';

const Badge = ({ count }) => {
  return (
    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {count}
    </span>
  );
};

export default Badge;
