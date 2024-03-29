import React, { Component } from 'react';

export default class EditorMeta extends Component {
    constructor(props){
        super(props);
        this.state = {
            meta: {
                title: '',
                keywords: '',
                description: ''
            }
        }
    }

    componentDidMount(){
        this.getMeta(this.props.virtualDom);
    }

    componentDidUpdate(prevProps){
        if(this.props.virtualDom !== prevProps.virtualDom){
            this.getMeta(this.props.virtualDom)
        }
    }

    getMeta(virtualDom){
        this.title = virtualDom.head.querySelector('title') || virtualDom.head.appendChild(virtualDom.createElement('title'));

        this.keywords = virtualDom.head.querySelector('meta[name="keywords"]');

        if(!this.keywords){
            this.keywords = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            this.keywords.setAttribute('name', 'keywords');
            this.keywords.setAttribute('content', ' ');
        }

        this.descr = virtualDom.querySelector('meta[name="description"]');

        if(!this.descr){
            this.descr = virtualDom.head.appendChild(virtualDom.createElement('meta'));
            this.descr.setAttribute('name', 'description');
            this.descr.setAttribute('content', ' ');
        }

        this.setState({
            meta: {
                title:this.title.innerHTML,
                keywords: this.keywords.getAttribute('content'),
                description: this.descr.getAttribute('content')
            }
        })
    }

    applyMeta(){
        this.title = this.state.meta.title;
        this.keywords.setAttribute('content', this.state.meta.keywords);
        this.descr.setAttribute('content', this.state.meta.description);
    }

    onValueChange(e){
        if(e.target.getAttribute('data-title')){
            e.persist();
            this.setState(({meta}) => {
                const newMeta = {
                    ...meta,
                    title: e.target.value
                }

                return {
                    meta: newMeta
                }
            })
        } else if(e.target.getAttribute('data-key')){
            e.persist();
            this.setState(({meta}) => {
                const newMeta = {
                    ...meta,
                    keywords: e.target.value
                }

                return {
                    meta: newMeta
                }
            })
        } else {
            e.persist();
            this.setState(({meta}) => {
                const newMeta = {
                    ...meta,
                    description: e.target.value
                }

                return {
                    meta: newMeta
                }
            })
        }
    }

    render(){
        const {target, modal} = this.props;
        const {title, keywords, description} = this.state.meta; 
        return(
            <div>
                <div id={target} uk-modal={modal.toString()} container="false">
                    <div className="uk-modal-dialog uk-modal-body">
                        <h2 className="uk-modal-title">Editing</h2>
                        <form>
                            <div className="uk-margin">
                                <input 
                                    data-title
                                    className="uk-input" 
                                    type="text" 
                                    placeholder="title" 
                                    value={title}
                                    onChange={(e) => this.onValueChange(e)}/>
                            </div>
                            <div className="uk-margin">
                                <textarea 
                                    data-key
                                    className="uk-textarea" 
                                    rows="5" 
                                    placeholder="keywords" 
                                    value={keywords}
                                    onChange={(e) => this.onValueChange(e)}></textarea>
                            </div>
                            <div className="uk-margin">
                                <textarea 
                                    data-descr
                                    className="uk-textarea" 
                                    rows="5" 
                                    placeholder="description" 
                                    value={description}
                                    onChange={(e) => this.onValueChange(e)}></textarea>
                            </div>
                        </form>
                        <p className="uk-text-right">
                            <button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
                            <button 
                                className="uk-button uk-button-primary uk-modal-close" 
                                type="button"
                                onClick={() => {this.applyMeta()}}
                                >Опубликовать</button>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}