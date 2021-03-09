import {Component} from 'react';
import axios from 'axios';

export default class EditorImg extends Component {
    constructor(elem, virtualElem , ...[onLoading, onLoaded, showNotifications]){
        super();
        this.elem = elem;
        this.virtualElem = virtualElem;
        this.elem.addEventListener('click', () => this.onClick());
        this.uploadImg = document.querySelector('#uploadfile');
        this.onLoading = onLoading;
        this.onLoaded = onLoaded;
        this.showNotifications = showNotifications;
    }

    onClick(){
        this.uploadImg.click();
        this.uploadImg.addEventListener('change', () => {
            if(this.uploadImg.files && this.uploadImg.files[0]){
                let formData = new FormData;
                formData.append('image', this.uploadImg.files[0]);
                this.onLoading();
                axios
                    .post('./api/uploadImg.php', formData, {
                        headers : {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    .then(res => {
                        this.virtualElem.src = this.elem.src = `./img/${res.data.src}`;
                    })
                    .catch(() => this.showNotifications('Error', 'danger'))
                    .finally(() => {
                        this.uploadImg.value = '';
                        this.onLoaded();
                    })
            }
        })
    }
}