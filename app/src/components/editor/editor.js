import '../../helpers/iframeLoader.js';
import React, { Component } from 'react';
import axios from 'axios';
import DomHelper from '../../helpers/domHelper';
import EditorText from '../editorText';
import Spinner from '../spinner';
import ModalSave from '../modalSave';
import ModalContent from '../modalContent';
import Panel from '../panel';
import UIkit from 'uikit';
import EditorMeta from '../editorMeta';
import EditorImg from '../editorImg';
import Login from '../login';

export default class Editor extends Component {
    constructor(){
            super();
            this.currentPage = 'index.html';
            this.state = {
                PageList: [],
                backupsList: [],
                PageName: "",
                loading: true,
                error: false,
                auth: false,
                passLengthErr: false,
                passErr: false
        }
        this.restoreBackUp = this.restoreBackUp.bind(this);
        this.onLoading = this.onLoading.bind(this);
        this.onLoaded = this.onLoaded.bind(this);
        this.save = this.save.bind(this);
        this.init = this.init.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    // Loading funcs 
    onLoading(){
        this.setState({
            loading: true
        })
    }

    onLoaded(){
        this.setState({
            loading: false
        })
    }
    // End of Loading funcs

    componentDidMount(){
        this.checkAuth();
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.auth !== prevState.auth){
            this.init(null, this.currentPage);
        }
    }

    checkAuth(){
        axios  
            .get('./api/checkAuth.php')
            .then(res => 
                this.setState({
                    auth: res.data.auth
                }))
    }

    login(pass){
        if(pass.length > 3){
            axios
                .post('./api/login.php', {"password": pass})
                .then(res => 
                    this.setState({
                        auth: res.data.auth,
                        passErr: !res.data.auth,
                        passLengthErr: false
                    }))
        } else {
            this.setState({
                passErr: false,
                passLengthErr: true
            })
        }
    }

    logout(){
        axios.post('./api/logout.php')
        .then(() => {
            window.location.replace("/");
        })
    }

    init(e, page){
        if(e){
            e.preventDefault();
        }
        if(this.state.auth){
            this.onLoading();
            this.iframe = document.querySelector('iframe');
            this.open(page, this.onLoaded());
            this.LoadPageList();
            this.loadBackUpList();
        }
    }

    open(page, cb){
        this.currentPage = page;

        axios
            .get(`../${page}?rnd=${Math.random()}`)
            .then(res => DomHelper.parseStrtoDom(res.data))
            .then(DomHelper.wrapTextNodes)
            .then(DomHelper.setAttrToImg)
            .then(dom => {
                this.virtualDom = dom;
                return dom;
            })
            .then(DomHelper.serializeDOMToStr)
            .then(html => axios.post('./api/saveTempList.php', {html}))
            .then(() => this.iframe.load('../12345blacklist.html'))
            .then(() => axios.post('./api/deleteTempPage.php'))
            .then(() => this.enableEditing())
            .then(() => this.injectStyles())
            .then(cb)
            
        this.loadBackUpList();
    }

    enableEditing(){
        this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(elem => {
            const id = elem.getAttribute('node-id');
            const virtualElem = this.virtualDom.body.querySelector(`[node-id="${id}"]`);
            new EditorText(elem, virtualElem);
        })

        this.iframe.contentDocument.body.querySelectorAll('[editableimg]').forEach(elem => {
            const id = elem.getAttribute('editableimg');
            const virtualElem = this.virtualDom.body.querySelector(`[editableimg="${id}"]`);
            new EditorImg(elem, virtualElem, this.onLoading, this.onLoaded, this.showNotifications);
        })
    }

    showNotifications(message, status){
        UIkit.notification({message, status})
    }

    injectStyles(){
        const style = this.iframe.contentDocument.createElement('style');
        style.innerHTML = `
            text-editor:hover {
                outline: 3px solid orange;
                outline-offset: 10px;
            }
            text-editor:focus {
                outline: 3px solid red;
                outline-offset: 10px;
            }
            [editableimg]:hover {
                outline: 3px solid orange;
                outline-offset: 10px;
            }
        `;
        this.iframe.contentDocument.head.appendChild(style);
    }

    async save(){
        this.onLoading();
        const newDom = this.virtualDom.cloneNode(this.virtualDom);
        DomHelper.unwrapTextNodes(newDom);
        DomHelper.removeAttrFromImg(newDom);
        const html = DomHelper.serializeDOMToStr(newDom);
        await axios
            .post('./api/savePage.php', {PageName: this.currentPage, html})
            .then(() => this.showNotifications('The process is succeed', 'success'))
            .catch(() => this.showNotifications('The process in in error', 'danger'))
            .finally(this.onLoaded);

        this.loadBackUpList();
    }

    LoadPageList(){
        axios
            .get('./api/pageList.php')
            .then(res => this.setState({PageList: res.data}))
    }

    loadBackUpList(){
        axios
            .get("./backups/backups.json")
            .then(res => this.setState({backupsList: res.data.filter(backup => {
                return backup.page === this.currentPage;
            })
        }))
    }

    restoreBackUp(e, backup){
        if(e){
            e.preventDefault();
        }
        UIkit.modal.confirm('Вы действительно хотите восстановить страницу из бекапа? Несохраненные данные будут утеряны!', {labels:{
            ok: "Восстановить", cancel: "Отменить"
        }})
        .then(() => {
            this.onLoading();
            return axios.post('./api/restoreBackUp.php', {"page": this.currentPage, "file": backup})
        })
        .then(() => {
            this.open(this.currentPage, this.onLoaded());
        })
    }

    render(){
        const {loading, PageList, backupsList, auth, passErr, passLengthErr} = this.state;
        const modal = true;
        let spinner;
                
        loading? spinner = <Spinner active/>: spinner = <Spinner/>;

        if(!auth){
            return <Login login={this.login} passerror={passErr} passlengtherror={passLengthErr}/>
        }

        return (
            <>
                <iframe src='' frameBorder="0"></iframe>
                <input id="uploadfile" type="file" accept="image/*" style={{display: 'none'}}/>
                {spinner}

                <Panel/>
                
                <ModalSave 
                    modal={modal} 
                    target={'modal-save'} 
                    method={this.save}
                    text={{title: 'Сохранение', question: 'Вы действительно хотите сохранить изменения?',
                    btn: 'Publish'}}/>
                <ModalSave 
                    modal={modal} 
                    target={'modal-logout'} 
                    method={this.logout}
                    text={{title: 'Выход', question: 'Вы действительно хотите выйти?',
                    btn: 'Exit'}}/>
                <ModalContent modal={modal} target={'modal-open'} data={PageList} redirect={this.init}/>
                <ModalContent modal={modal} target={'modal-backup'} data={backupsList} redirect={this.restoreBackUp}/>
                {this.virtualDom ? <EditorMeta modal={modal} target={'modal-meta'} virtualDom={this.virtualDom}/>: false}
            </>
        )
    }
}