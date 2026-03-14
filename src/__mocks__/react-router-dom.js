import React from 'react';

export const BrowserRouter = ({ children }) => <div data-testid="router">{children}</div>;
export const Routes = ({ children }) => <div>{children}</div>;
export const Route = ({ element }) => element;
export const Navigate = () => <div data-testid="navigate">Redirect</div>;
export const Link = ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>;
export const useNavigate = () => () => {};
export const useLocation = () => ({ pathname: '/', search: '', hash: '' });
export const Outlet = () => null;
