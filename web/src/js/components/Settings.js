import React from 'react';
import {Panel} from "./glui/ui/Panel";
import Form from "./glui/form/Form";
import Input from "./glui/form/Input";

export const Settings = (props) => (
    <div>
        <h1><span className="oi" data-glyph="wrench"/> Settings </h1>
        <Panel dark title={
                <div><span className="oi" data-glyph="person"/> Add a new user</div>}>
            <Form submit="Add" vertical>
                <Input id="username" label="Username"/>
                <Input id="password" type="password" label="Password"/>
                <Input id="password_repeat" type="password" label="Repeat Password"/>
            </Form>
        </Panel>
    </div>
);