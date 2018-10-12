import React, { Component } from 'react';
import Header from './Header';
import Meta from './Meta';
import styled from 'styled-components';

const MyButton = styled.button`
background: red;
font-size: 50px;
span {
    font-size: 100px;
}
`;

class Page extends Component {
    render() {
        return (
            <div>
                <Meta />
                <Header />
                <MyButton>Click <span>Me</span></MyButton>
                <p>Hey I'm the page component</p>
                {this.props.children}
            </div>
        );
    }
}

export default Page;