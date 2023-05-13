import React from 'react';
import './App.css';
import {HeaderSimple} from "../c1-features/f1-header/Header";
import {PATH, RoutesComponent} from "../c2-commonComponents/routes/Routes";
import {Router} from 'react-router-dom';

export function App() {

    const appLinks = [
        {link: '/vacancySearch', label: 'Поиск Вакансий'},
        {link: '/selectedVacancies', label: 'Избранное'}]

    return (
        <div className="App">
                <HeaderSimple links={appLinks}/>
                <RoutesComponent/>
        </div>
    );
}

