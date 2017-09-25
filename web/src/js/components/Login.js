import React, {Component} from 'react';
import Form from "./glui/form/Form";
import Input from "./glui/form/Input";

export default class Login extends Component {

    render() {
        return (
            <div>


                <div className="scrib-login">

                    <Form vertical action="#" method="post" submit="Login" onChange={(id, value, success, message) => {
                        //
                    }} onSubmit={values=>{
                        console.log(values)
                    }}>

                        <Input id="username" label="Email Adress" required  />
                        <Input id="password" label="Password" required  />

                    </Form>

                </div>

            </div>







        );
    }
}
