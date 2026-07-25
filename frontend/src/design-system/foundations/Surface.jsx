import React from 'react';

export const Surface = React.forwardRef(({ 
  as: Component = 'div',
  elevation = 'none', 
  radius = 'none', 
  background = 'surface-default',
  className = '', 
  children, 
  ...props 
}, ref) => {
  const style = {
    backgroundColor: `var(--ds-color-${background})`,
    boxShadow: `var(--ds-shadow-${elevation})`,
    borderRadius: `var(--ds-radius-${radius})`
  };
  
  return (
    <Component ref={ref} style={style} className={className} {...props}>
      {children}
    </Component>
  );
});

Surface.displayName = 'Surface';
