import React from 'react';
import { Link } from 'react-router-dom';
import * as s from './NavigationBar.style';

// Components
import Container from '../Container';
import AccountMenu from '../AccountMenu';
import CreateTabButton from 'modules/tab/components/CreateTabButton';

const NavigationBar = () => (
    <s.TabBarWrapper>
        <Container background="#253140">
            <s.Logo>Oak</s.Logo>
            <s.Menu>
                <li>
                    <Link to="/me/tabs">
                        Tablaturas
                    </Link>
                </li>
            </s.Menu>
            <s.Button>
                <CreateTabButton />
            </s.Button>
            <AccountMenu />
        </Container>
    </s.TabBarWrapper>
);

export default NavigationBar;
