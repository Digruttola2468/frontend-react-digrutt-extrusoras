import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ---- MENU ----
import MainHeader from './Menu';

// ---- PAGES ----
import Login from './pages/LogIn';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Inventario from './pages/Inventario';
import NotaEnvios from './pages/NotaEnvios';
import ClientesPage from './pages/Clientes';

import { NoAuthenticateRoute, PrivateRoute, AuthenticateGeneralRoute } from './PrivateRoute';
import FormNewCliente from './components/forms/formNewCliente';
import NewNotaEnvio from './components/tables/pageNotaEnvios/NewNotaEnvio';
import FormNewInventario from './components/forms/FormNewInventario';
import { NotaEnvioProvider } from './context/NotaEnvios.context';

const App: React.FC = () => {
    return (
        <>
            <Router >
                <header> <MainHeader roles={[]} /> </header>
                <main>
                    <Routes>
                        <Route path="/" element={<AuthenticateGeneralRoute><Home /></AuthenticateGeneralRoute>} />
                        <Route path="/login" element={<NoAuthenticateRoute> <Login /> </NoAuthenticateRoute>} />
                        <Route path="/register" element={<NoAuthenticateRoute> <SignUp /> </NoAuthenticateRoute>} />
                        <Route
                            path="/inventario"
                            element={<AuthenticateGeneralRoute><PrivateRoute roles={['admin', 'office']}><Inventario /></PrivateRoute></AuthenticateGeneralRoute>}
                        >
                            <Route path='newProduct' element={<FormNewInventario/>} />
                        </Route>
                        <Route
                            path="/notaEnvios"
                            element={<AuthenticateGeneralRoute><PrivateRoute roles={['admin', 'office']}><NotaEnvios /></PrivateRoute></AuthenticateGeneralRoute>}
                        />
                            
                        <Route
                            path="/notaEnvios/crear"
                            element={<AuthenticateGeneralRoute><PrivateRoute roles={['admin', 'office']}> <NotaEnvioProvider> <NewNotaEnvio /> </NotaEnvioProvider> </PrivateRoute></AuthenticateGeneralRoute>}
                        />
                        <Route
                            path="/clientes/*"
                            element={<AuthenticateGeneralRoute><PrivateRoute roles={['admin', 'office']}><ClientesPage /></PrivateRoute></AuthenticateGeneralRoute>}
                        >
                            <Route path='newClient' element={<FormNewCliente/>} />
                        </Route>
                    </Routes>
                </main>
            </Router>
        </>
    );
};

export default App;