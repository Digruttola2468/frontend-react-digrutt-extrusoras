import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/User.context';

interface PrivateRouteProps {
    roles: string[];
    children?: ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (user && !roles.includes(user.role)) {
        return <Navigate to="/login" state={{ from: location }} />;
    }else 

    return <>{children}</>;
};

export const AuthenticateGeneralRoute: React.FC<{children: ReactNode}> = ({children}) => {
    const { user } = useAuth();
    const location = useLocation();

    if (user) 
        return <>{children}</>;
    else 
        return <Navigate to="/login" state={{ from: location }} />;
}

export const NoAuthenticateRoute: React.FC<{children: ReactNode}> = ({children}) => {
    const { user } = useAuth();
    const location = useLocation();
    
    // No existe el usuario
    if (!user) {
        return <>{children}</>;
    }else 
        return <Navigate to="/" state={{ from: location }} />;
}