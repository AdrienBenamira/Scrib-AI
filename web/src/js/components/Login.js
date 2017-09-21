import React, {Component} from 'react';
import Form from "./glui/form/Form";
import Input from "./glui/form/Input";

export default class Login extends Component {

    render() {
        return (
            <div>


                <div className="scrib-login">

                    <Form action="#" method="post" submit="Se connecter" onChange={(id, value, success, message) => {
                        //
                    }} onSubmit={values=>{
                        console.log(values)
                    }}>

                        <Input id="username" label="Adresse mail" required  />
                        <Input id="p" label="Mot de passe" required  />

                    </Form>

                </div>

            </div>










        );
    }
}
