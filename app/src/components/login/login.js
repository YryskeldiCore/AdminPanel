import React, { Component } from 'react';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            pass: ''
        }
    }

    onChangePass(e){
        this.setState({
            pass: e.target.value
        })
    }

    render(){
        const {pass} = this.state;
        const {login, passerror, passlengtherror} = this.props;

        let passError, passLengthError;

        passerror ? passError = <span className="login-error">Uncorrect Password</span>: null;
        passlengtherror ? passLengthError = <span className="login-error">Your password length less than 3</span>: null;

        return(
            <div className="login-container">
                <div className="login">
                    <h2 className="uk-modal-title uk-text-center">Authorization</h2>
                    <div className="uk-margin-top uk-text-lead">Password:</div>
                    <input 
                        type="password" 
                        className="uk-input uk-margin-top" 
                        placeholder="Type password"
                        value={pass}
                        onChange={(e) => this.onChangePass(e)}/>
                        {passError}
                        {passLengthError}
                    <button 
                        className="uk-margin-top uk-button uk-button-primary"
                        onClick={() => login(pass)}
                        >Log in</button>
                </div>
            </div>
        )
    }
}