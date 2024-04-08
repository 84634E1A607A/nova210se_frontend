import { Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

interface SidebarLinkProps {
  to: string;
  title: string;
  icon: React.ReactNode;
}

export function SidebarLink({ to, title, icon }: SidebarLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [, setIsHidden] = useState(!isActive);

  useEffect(() => {
    setIsHidden(!isActive);
  }, [isActive]);

  return (
    <li className="flex justify-center items-center">
      <Link
        to={to}
        title={title}
        className={`h-20 w-32 px-6 flex justify-center items-center ${isActive ? 'text-white bg-teal-800' : 'hover:text-white'}`}
        style={{
          transition: 'background-color 0.3s, color 0.3s',
        }}
      >
        <i className="mx-auto">{icon}</i>
      </Link>
    </li>
  );
}
